const fetch =  require("node-fetch");
const { GoogleGenAI  } = require("@google/genai");
const { NWSWeatherConditions } = require("../services/conditionsServices")
require('dotenv').config(); 


const gcpApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: gcpApiKey });

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

const getClosestBuoyID = async (targetLat, targetLng) => {

    // Fetch the raw station_table.txt
    const response = await fetch("https://www.ndbc.noaa.gov/data/stations/station_table.txt");
    if (!response.ok) {
    throw new Error(`Failed to download station table: ${response.status} ${response.statusText}`);
    }
    const rawText = await response.text();

    // Split into lines and filter out header/comment lines
    const lines = rawText.split("\n").filter(line => {
        // Skip blank lines or lines starting with "#" (header)
        return line.trim() !== "" && !line.trim().startsWith("#");
    });

    // Parse each line into { id, lat, lon }
    // Format: STATION_ID | OWNER | TTYPE | HULL | NAME | PAYLOAD | LOCATION | TIMEZONE | FORECAST | NOTE
    const stations = lines.map(line => {
        const fields = line.split("|");
        const stationId = fields[0].trim();

        // LOCATION field looks like:
        // "37.356 N 122.881 W (37°21'20\" N 122°52'51\" W)"
        // split on space: [ "37.356", "N", "122.881", "W", "(...)" ]
        const locationTokens = fields[6].trim().split(" ");
        let lat = parseFloat(locationTokens[0]);        // locationTokens[0] = latitude number (string)
        let latHem = locationTokens[1].toUpperCase();   // locationTokens[1] = "N" or "S"
        let lng = parseFloat(locationTokens[2]);        // locationTokens[2] = longitude number (string)
        let lngHem = locationTokens[3].toUpperCase();   // locationTokens[3] = "E" or "W"

        if (latHem === "S")  lat = -lat;
        if (lngHem === "W")  lng = -lng;

        return { id: stationId, lat, lon: lng };
    });

    let closetStationId = null; 
    let minDistance = Infinity; 
    for (const station of stations){
        const d = haversineDistance(targetLat, targetLng, station.lat, station.lon)
        if (d < minDistance){
            minDistance = d; 
            closestStationId = station.id; 
        }
    }

    return closetStationId;
}

exports.getConditions = async (req, res) => {
    const { lat, lng } = req.query; 
    if(!lat || !lng){
        return res.status(400).json({ error: "Missing required query parameters: lat, lng" });
    }
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    try{

        const { conditionDetails, windDirection, wind } = NWSWeatherConditions(lat, lng); 
        // Fetch Tide data from NOAA Tides API
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
        let nearestStation = stationsData.stations[0]; 
        let minDist = haversineDistance(
            userLat,
            userLng, 
            parseFloat(nearestStation.lat),
            parseFloat(nearestStation.lng)
        );

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
        const stationId = nearestStation.id; 
        const stationName = nearestStation.name;
        console.log(`Nearst tide station: ${stationName} - ${stationId}`)

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
                tideDetails = `High tide at ${nextHigh.t}: ${nextHigh.v}  ft. High tide at ${nextLow.t}: ${nextLow.v} ft.`; 
            }
        }
        console.log(`Tide: ${tide} - ${tideDetails}`)

        //


        // Generate a natural-language overview via GCP Generative Langauge API
        const promptText = `Generate a concise surf report overview using the following data:
            - Condition Details: ${conditionDetails}
            - Wind: ${wind}
            - Wind Direction: ${windDirection}
            - Tide: ${tide}
            - Tide Details: ${tideDetails}`;

        const aiRes = await ai.models.generateContent({
            model: "gemini-2.0-flash", 
            contents: promptText,
            config: {
                systemInstruction: "You are a professional broadcast meteorologist.",
            },
        }); 
        const aiOverview = aiRes.text;
        console.log(`AI Overview: ${aiOverview}`)

        // Respond with structured JSON
        return res.json({ wind, windDirection, tide, tideDetails, aiOverview });
    }catch(err){
        console.log("Conditions service error: " , err); 
        res.status(500).json({ error: "Failed to fetch surf conditions"});
    }
}
