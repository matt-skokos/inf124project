const fetch =  require("node-fetch");

const NWS_URL = "https://api.weather.gov";
const NOAA_URL = "https://api.tidesandcurrents.noaa.gov";
const NDBC_URL = "https://www.ndbc.noaa.gov";

const haversineDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = deg => (deg * Math.PI) / 180;
    const R = 6371  // Earth radius in kn 
    const dLat = toRad(lat2 - lat1); 
    const dLon = toRad(lng2 - lng1); 
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const km = R * c;
    const nm = km * 0.539957; // convert km to nautical miles
    return nm;
}

const fetchAllBuoyStations = async () => {
    // Fetch the raw station_table.txt
    const response = await fetch(`${NDBC_URL}/data/stations/station_table.txt`);
    if (!response.ok) {
    throw new Error(`Failed to download station table: ${response.status} ${response.statusText}`);
    }
    const rawText = await response.text();

    const lines = rawText.split("\n").filter(line => line.trim() !== "" && !line.trim().startsWith("#"));
    return lines.map(line => {
        const fields = line.split("|");
        const stationId = fields[0].trim();
        const stationName = fields[4].trim();
        const locTokens = fields[6].trim().split(" ");
        let lat = parseFloat(locTokens[0]);
        let latHem = locTokens[1].toUpperCase();
        let lng = parseFloat(locTokens[2]);
        let lngHem = locTokens[3].toUpperCase();
        if (latHem === "S") lat = -lat;
        if (lngHem === "W") lng = -lng;
        return { id: stationId, name: stationName, lat, lng };
    });
}

const getSortedBuoys = async (lat, lng, blacklist = []) => {
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    const allStations = await fetchAllBuoyStations();

    // filter out blacklist IDs 
    const candidates = allStations.filter(st => !blacklist.includes(st.id));

    // Sort by haversine distance
    candidates.sort((a, b) => {
        const da = haversineDistance(userLat, userLng, a.lat, a.lng);
        const db = haversineDistance(userLat, userLng, b.lat, b.lng);
        return da - db;
    });
    return candidates;
}

const fetchBuoyRealtime = async(buoyId) => {
    const url = `${NDBC_URL}/data/realtime2/${buoyId}.txt`;
    const resp = await fetch(url);
    if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Buoy ${buoyId} fetch error: ${resp.status} ${txt}`);
    }
    return await resp.text();
}

const  NWSWeatherPredicitions = async (lat, lng, timeperiod=1) => {
    // Fetch gridpoint metadata for the location
    const nwsPointsURL = `${NWS_URL}/points/${lat},${lng}`
    const pointRes = await fetch(nwsPointsURL);
    if(!pointRes.ok){
        throw new Error(`NWS points fetch error (${pointRes.status}): ${nwsPointsURL}`); 
    }

    const pointData = await pointRes.json(); 
    const { gridId, gridX, gridY } = pointData.properties

    // Fetch the nearest forecast for the most recent period from NWS (api.weather)
    const nwsGridpointURL = `${NWS_URL}/gridpoints/${gridId}/${gridX},${gridY}/forecast`
    const forecastRes = await fetch(nwsGridpointURL)
    if(!forecastRes.ok){
        throw new Error(`NWS forecast fetch error (${forecastRes.status}): ${nwsGridpointURL}`)
    }

    const forecastData = await forecastRes.json();
    let forecastPeriods = forecastData.properties.periods;
    forecastPeriods = forecastPeriods.filter((p) => p.isDaytime);   // Filter only daytime periods
    forecastPeriods = forecastPeriods.slice(0, parseInt(timeperiod));   // Take the first n daytime periods
    return forecastPeriods;
}

const  NWSWeatherConditions = async (lat, lng) => {
    // Get conditions for today
    const forecastPeriods = await NWSWeatherPredicitions(lat, lng);
    const currentConditions = forecastPeriods[0]

    // Extract surf-related data
    const conditionDetails = currentConditions.detailedForecast;
    const windDirection = currentConditions.windDirection;
    const wind = currentConditions.windSpeed;
    console.log(`Local Conditions: ${conditionDetails}\nWind: ${wind} - ${windDirection}`)

    return { conditionDetails, windDirection, wind }
}

// Fetch Tide data from NOAA Tides API
const NOAATidePredictions = async (lat, lng, timeperiod=1) => { 
    // retrieve all tide-prediction stations
    const stationsURL = `${NOAA_URL}/mdapi/prod/webapi/stations.json?units=english&type=tidepredictions`;
    const stationsRes = await fetch(stationsURL); 
    if(!stationsRes.ok){
        const stationsText = await stationsRes.text();
        throw new Error(`NOAA stations fetch error: ${stationsRes.status} - ${stationsText}`); 
    }

    const stationsData = await stationsRes.json();
    if(!stationsData.stations || stationsData.stations.length === 0){
        throw new Error(`No tidal stations found near the provided coordinates`); 
    }

    // Find nearest station for tide predictions 
    const { stationId, stationName } = (function(lat, lng){
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);

        let nearestStation = null; 
        let minDist = Infinity;
        stationsData.stations.forEach(stn => {
            const dist = haversineDistance(
                userLat,
                userLng, 
                parseFloat(stn.lat),
                parseFloat(stn.lng)
            );
            if (dist < minDist) {
                minDist = dist; 
                nearestStation = stn;
            }
        });
        console.log(`Nearst tide station: (${nearestStation.id})${nearestStation.name} distance: ${minDist}`);
        return { stationId: nearestStation.id, stationName: nearestStation.name };
    })(lat, lng);

    // Build date strings
    const now = new Date(); 
    const endDate = new Date(now); 
    endDate.setDate(now.getDate() + parseInt(timeperiod));
    now.setDate(now.getDate() - 1);

    const formatDate = date => {
        const yyyy = date.getFullYear()
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}${mm}${dd}`;
    };

    const beginDateStr = formatDate(now); 
    const endDateStr = formatDate(endDate); 

    // Fetch high/low tide predictions
    const tideURL = `${NOAA_URL}/api/prod/datagetter?station=${stationId}` +
        `&product=predictions&interval=hilo&datum=MLLW&units=english&time_zone=lst_ldt` +
        `&format=json&begin_date=${beginDateStr}&end_date=${endDateStr}`;
    const tideRes = await fetch(tideURL); 
    const tideData = await tideRes.json(); 
    if(!tideRes.ok){
        throw new Error(`NOAA tide data fetch error (${tideRes.status}): ${tideData?.message}\n${tideURL}`); 
    }
    
    return tideData.predictions || [];
}

const NOAATideConditions = async (lat, lng, userTimezone = 'UTC', userOffset = new Date().getTimezoneOffset()) => {
    const predictions = await NOAATidePredictions(lat, lng,);

    userOffset = parseInt(userOffset, 10);
    console.log(`userTimezone - ${userTimezone}`);
    console.log(`userOffset - ${userOffset}`);

    const withEpoch = predictions.map(p => {
        const [datePart, timePart] = p.t.split(' ')
        const year  = parseInt(datePart.slice(0, 4), 10)
        const month = parseInt(datePart.slice(5, 7), 10) - 1
        const day   = parseInt(datePart.slice(8, 10), 10)
        const [hour, minute] = timePart.split(':').map(n => parseInt(n, 10))

        // Date.UTC(...) gives us the *UTC* epoch for that Y/M/D h:m *as if* it were Z,
        // so to shift from the station’s local zone → UTC, we add offset minutes:
        const epoch = Date.UTC(year, month, day, hour, minute) + userOffset * 60_000

        return { ...p, epoch }
    })

    // only keep those at-or-after “now”
    const now = Date.now()
    const future = withEpoch.filter(p => p.epoch >= now)

    // Determine next low and high tides 
    const nextLow   = future.find(p => p.type === 'L');
    const nextHigh  = future.find(p => p.type === 'H');
    console.log(`nextLow - ${JSON.stringify(nextLow)}`);
    console.log(`nextHigh - ${JSON.stringify(nextHigh)}`);

    let tide = 'N/A';
    let tideEpoch   = now
    let tideDetails = 'Tide data is unavailable for the selected coordinates and date.'; 

    let chosen, other;
    if(nextLow && nextHigh){
        if (nextLow.t < nextHigh.t){
            chosen = nextLow;
            other = nextHigh;
            tide = `Low`
        }else{ 
            chosen = nextHigh;
            other = nextLow;
            tide = 'High'
        }
    }

    tideEpoch = chosen.epoch

    // build details string in user’s timezone
    const showTime = e => new Date(e)
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: userTimezone
    })

    if (chosen && other) {
      tideDetails = `${tide} tide at ${showTime(chosen.epoch)}: ${chosen.v}ft. `
        + `${tide === 'Low' ? 'High' : 'Low'} tide at ${showTime(other.epoch)}: ${other.v}ft.`
    } else {
      tideDetails = `${tide} tide at ${showTime(chosen.epoch)}: ${chosen.v}ft.`
    }

    // final formatted string for the card
    const tideTime = new Date(tideEpoch)
        .toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: userTimezone
    });

    console.log(`${tideDetails}`)
    return { tide, tideTime, tideDetails };
}

const NDBCBuoyConditions = async (lat, lng) => {
    const blacklist = ["46230"];
    
    const sortedBuoys = await getSortedBuoys(lat, lng, blacklist); 
    if (sortedBuoys.length === 0){
        throw new Error('No active buoys foudn within available dataset'); 
    }

    for(let i = 0; i < sortedBuoys.length; i++){
        const nearest = sortedBuoys[i]; 
        try{
            const rawText = await fetchBuoyRealtime(nearest.id)

            // parse rawtext as needed for wave data
            const lines = rawText.trim().split("\n"); 

            // first two lines are header: remove '#' and split by whitespace
            const header = lines[0].replace(/#/g, '').trim().split(/\s+/);

            // data lines follow: skip first two header rows
            const dataLines = lines.slice(2);
            if (dataLines.length === 0){
                throw new Error(`No data rows for buoy ${nearest.id}`);
            }

            // Get the most recent data row (first element of dataLines)
            const mostRecent = dataLines[0].trim().split(/\s+/);

            // Find WVHT index
            const idxWVHT = header.indexOf('WVHT');
            const idxMWD = header.indexOf('MWD');
            if (idxWVHT < 0) {
                throw new Error(`WVHT column not found for buoy ${nearest.id}`);
            }
            const waveHeight = mostRecent[idxWVHT];
            const waveDirection = mostRecent[idxMWD];
            
            console.log(`Nearest active buoy: ${nearest.id} ${nearest.name}\nWave Height: ${waveHeight} Wave Direction: ${waveDirection}`);
            return { waveHeight, waveDirection };
        } catch (err){
            console.warn(`Failed to fetch data for buoy ${nearest.id} ${nearest.name}; adding to blacklist`); 
            blacklist.push(nearest.id)
            // continue to next buoy
        }
    }
}

module.exports = { NWSWeatherPredicitions, NOAATidePredictions, NWSWeatherConditions, NOAATideConditions, NDBCBuoyConditions }