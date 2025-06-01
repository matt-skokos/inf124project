const fetch =  require("node-fetch");

const NWS_URL = "https://api.weather.gov"

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
    const response = await fetch("https://www.ndbc.noaa.gov/data/stations/station_table.txt");
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
    const url = `https://www.ndbc.noaa.gov/data/realtime2/${buoyId}.txt`;
    const resp = await fetch(url);
    if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Buoy ${buoyId} fetch error: ${resp.status} ${txt}`);
    }
    return await resp.text();
}

const  NWSWeatherConditions = async (lat, lng) => {
    // Fetch gridpoint metadata for the location
    const pointRes = await fetch(`${NWS_URL}/points/${lat},${lng}`);
    if(!pointRes.ok){
        throw new Error(`NWS points fetch error: ${pointRes.status}`); 
    }

    const pointData = await pointRes.json(); 
    const { gridId, gridX, gridY } = pointData.properties

    // Fetch the nearest forecast for the most recent period from NWS (api.weather)
    const forecastRes = await fetch(
        `${NWS_URL}/gridpoints/${gridId}/${gridX},${gridY}/forecast`
    )
    if(!forecastRes.ok){
        throw new Error(`NWS forecast fetch error: ${forecastRes.status}`)
    }

    const forecastData = await forecastRes.json();
    const forecastPeriods = forecastData.properties.periods;
    const currentConditions = forecastPeriods[0]

    // Extract surf-related data
    const conditionDetails = currentConditions.detailedForecast;
    const windDirection = currentConditions.windDirection;
    const wind = currentConditions.windSpeed;
    console.log(`Local Conditions: ${conditionDetails}\nWind: ${wind} - ${windDirection}`)

    return { conditionDetails, windDirection, wind }
}

// Fetch Tide data from NOAA Tides API
const NOAATideCurrentConditions = async (lat, lng) => { 
    // retrieve all tide-prediction stations
    const stationsURL = `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?units=english&type=tidepredictions`;
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

    // Build date Strings for today
    const now = new Date(); 
    const tomorrowDate = new Date(now); 
    tomorrowDate.setDate(now.getDate() + 1);

    const formatDate = date => {
        const yyyy = date.getFullYear()
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}${mm}${dd}`;
    };

    const beginDateStr = formatDate(now); 
    const endDateStr = formatDate(tomorrowDate); 

    // Fetch high/low tide predictions
    const tideURL = 
        `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=${stationId}` +
        `&product=predictions&interval=hilo&datum=MLLW&units=english&time_zone=lst_ldt` +
        `&format=json&begin_date=${beginDateStr}&end_date=${endDateStr}`;
    const tideRes = await fetch(tideURL); 
    if(!tideRes.ok){
        throw new Error(`NOAA tide fetch error: ${tideRes.status}`); 
    }
    const tideData = await tideRes.json(); 
    const predictions = tideData.predictions || []; 

    // Determine next low and high tides 
    const upcoming = predictions.filter(p => new Date(p.t) >= now);
    const nextLow = upcoming.find(p => p.type === 'L');
    const nextHigh = upcoming.find(p => p.type === 'H');

    let tide = 'N/A'; 
    let tideDetails = 'Tide data is unavailable for the selected coordinates and date.'; 
    if(nextLow && nextHigh){
        const lowTime = new Date(nextLow.t); 
        const highTime = new Date(nextHigh.t); 
        if (lowTime < highTime){
            tide = 'Low'; 
            tideDetails = `Low tide at ${nextLow.t}: ${nextLow.v} ft. High tide at ${nextHigh.t}: ${nextHigh.v} ft.`; 
        }else{ 
            tide = 'High'; 
            tideDetails = `High tide at ${nextHigh.t}: ${nextHigh.v}  ft. Low tide at ${nextLow.t}: ${nextLow.v} ft.`; 
        }
    }
    console.log(`Tide: ${tide} - ${tideDetails}`)

    return { tide, tideDetails };
}

const NDBCBuoyConditions = async (lat, lng) => {
    const blacklist = [];
    
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
            
            console.log(`Using buoy ${nearest.id} ${nearest.name} wave height: ${waveHeight} wave direction: ${waveDirection}`);
            return { waveHeight, waveDirection };
        } catch (err){
            console.warn(`Failed to fetch data for buoy ${nearest.id} ${nearest.name}; adding to blacklist`); 
            blacklist.push(nearest.id)
            // continue to next buoy
        }
    }
}

module.exports = { NWSWeatherConditions, NOAATideCurrentConditions, NDBCBuoyConditions }