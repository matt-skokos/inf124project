const { NWSWeatherConditions, NOAATideCurrentConditions, NDBCBuoyConditions } = require("../services/conditionsServices")
const { genConditionOverview } = require("../services/genTextServices")
const { metersToFeet, degreesToDirection } = require("../utils");
require('dotenv').config(); 

exports.getWaveConditions = async (req, res) => {
    const { lat, lng } = req.query; 
    if(!lat || !lng){
        return res.status(400).json({ error: "Missing required query parameters: lat, lng" });
    }

    try{
        let { waveHeight, waveDirection } = await NDBCBuoyConditions(lat, lng);
        waveHeight = metersToFeet(waveHeight).toFixed(1);
        waveDirection = degreesToDirection(waveDirection);
        return res.json({ waveHeight, waveDirection});

    }catch(err){
        console.log("Conditions service error: " , err); 
        res.status(500).json({ error: "Failed to fetch wave conditions"});
    }
}

exports.getWindConditions = async (req, res) => {
    const { lat, lng } = req.query; 
    if(!lat || !lng){
        return res.status(400).json({ error: "Missing required query parameters: lat, lng" });
    }
    
    try{
        const { conditionDetails, windDirection, wind } = await NWSWeatherConditions(lat, lng);
        return res.json({ wind, windDirection });

    }catch(err){
        console.log("Conditions service error: " , err); 
        res.status(500).json({ error: "Failed to fetch wind conditions"});
    }
}

exports.getTideConditions = async (req, res) => {
    const { lat, lng } = req.query; 
    if(!lat || !lng){
        return res.status(400).json({ error: "Missing required query parameters: lat, lng" });
    }
    
    try{
        const { tide, tideDetails} = await NOAATideCurrentConditions(lat,lng); 
        return res.json({ tide, tideDetails });

    }catch(err){
        console.log("Conditions service error: " , err); 
        res.status(500).json({ error: "Failed to fetch tide conditions"});
    }
}

exports.getConditionsOverview = async (req, res) => {
    const { lat, lng } = req.query; 
    if(!lat || !lng){
        return res.status(400).json({ error: "Missing required query parameters: lat, lng" });
    }

    try{
        let { waveHeight, waveDirection } = await NDBCBuoyConditions(lat, lng);
        const { conditionDetails, windDirection, wind } = await NWSWeatherConditions(lat, lng);
        const { tide, tideDetails} = await NOAATideCurrentConditions(lat,lng); 

        waveHeight = metersToFeet(waveHeight).toFixed(1);
        waveDirection = degreesToDirection(waveDirection);

        // Generate a natural-language overview via GCP Generative Langauge API
        const promptText = `Generate a concise surf report overview using the following data:
            - Condition Details: ${conditionDetails}
            - Wave Height: ${waveHeight} ft
            - Wave Direction: ${waveDirection}
            - Wind: ${wind}
            - Wind Direction: ${windDirection}
            - Tide: ${tide}
            - Tide Details: ${tideDetails}`;

        const aiOverview = await genConditionOverview(promptText);

        // Respond with structured JSON
        return res.json({ waveHeight, waveDirection, wind, windDirection, tide, tideDetails, aiOverview });
    }catch(err){
        console.log("Conditions service error: " , err); 
        res.status(500).json({ error: "Failed to fetch surf conditions"});
    }
}
