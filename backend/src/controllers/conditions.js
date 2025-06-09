const { NWSWeatherConditions, NOAATideConditions, NDBCBuoyConditions, NOAATidePredictions, NWSWeatherPredicitions } = require("../services/conditionsServices")
const { genReport } = require("../services/genTextServices")
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
        console.log("Conditions service error:", err); 
        res.status(500).json({ error: "Failed to fetch wave conditions"});
    }
}

exports.getWindPredictions = async (req, res) => {
    const { lat, lng, timeperiod } = req.query; 
    if(!lat || !lng){
        return res.status(400).json({ error: "Missing required query parameters: lat, lng" });
    }
    
    try{
        const predictions = await NWSWeatherPredicitions(lat, lng, !timeperiod? 1 : timeperiod);
        return res.json({ predictions });

    }catch(err){
        console.log("Conditions service error: " , err); 
        res.status(500).json({ error: "Failed to fetch wind conditions"});
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

exports.getTidePredictions = async (req, res) => {
    const { lat, lng, timeperiod } = req.query; 
    if(!lat || !lng){
        return res.status(400).json({ error: "Missing required query parameters: lat, lng" });
    }
    
    try{
        const predictions = await NOAATidePredictions(lat, lng, !timeperiod? 1 : timeperiod); 
        return res.json({ predictions });
    }catch(err){
        console.log("Conditions service error: " , err); 
        res.status(500).json({ error: "Failed to fetch tide conditions"});
    }
}

exports.getTideConditions = async (req, res) => {
    const { lat, lng, timezone } = req.query; 
    if(!lat || !lng){
        return res.status(400).json({ error: "Missing required query parameters: lat, lng" });
    }

    const userTimezone = timezone || 'UTC'
    
    try{
        const {tide, tideTime, tideDetails} = await NOAATideConditions(lat,lng, userTimezone);
        return res.json({ tide, tideTime, tideDetails });
    }catch(err){
        console.log("Conditions service error: " , err); 
        res.status(500).json({ error: "Failed to fetch tide conditions"});
    }
}

exports.getPredictionOverview = async (req, res) => {
    const { loc:location , lat, lng, timeperiod } = req.query; 
    if(!lat || !lng){
        return res.status(400).json({ error: "Missing required query parameters: lat, lng" });
    }
    if(!location){
        return res.status(400).json({ error: "Missing required query parameter: 'loc' for location name" });
    }

    try{
        let { waveHeight, waveDirection }   = await NDBCBuoyConditions(lat, lng);
        const weatherPredictions            = await NWSWeatherPredicitions(lat, lng, timeperiod);
        const tidePredictions               = await NOAATidePredictions(lat,lng, timeperiod);

        // Generate a natural-language overview via GCP Generative Langauge API
        const promptText = `Generate a concise recommendation on the best time go surfing in the next ${timeperiod} days at ${location}.
        Use the following forecast data:
            - Wave Height: ${metersToFeet(waveHeight)} ft
            - Wave Direction: ${degreesToDirection(waveDirection)}
            - 3-day weather forecast: ${JSON.stringify(weatherPredictions)}
            - 3-day tide forecast: ${JSON.stringify(tidePredictions)}`;

        const aiReport = await genReport(promptText);
        return res.json({ aiReport });

    }catch(err){
        console.log("Conditions controller error:", err); 
        res.status(500).json({ error: "Failed to fetch surf preductions"});
    }
}

exports.getConditionsOverview = async (req, res) => {
    const { loc: location, lat, lng, timezone } = req.query; 
    if(!lat || !lng){
        return res.status(400).json({ error: "Missing required query parameters: lat, lng" });
    }
    if(!location){
        return res.status(400).json({ error: "Missing required query parameter: 'loc' for location name" });
    }

    try{
        let { waveHeight, waveDirection }               = await NDBCBuoyConditions(lat, lng);
        const { conditionDetails, windDirection, wind } = await NWSWeatherConditions(lat, lng);
        const { tide, tideTime, tideDetails}            = await NOAATideConditions(lat,lng, timezone); 

        waveHeight = metersToFeet(waveHeight).toFixed(1);
        waveDirection = degreesToDirection(waveDirection);

        // Generate a natural-language overview via GCP Generative Langauge API
        const promptText = `Generate a concise overview of surf conditions at ${location}. Use the following data:
            - Condition Details: ${conditionDetails}
            - Wave Height: ${waveHeight} ft
            - Wave Direction: ${waveDirection}
            - Wind: ${wind}
            - Wind Direction: ${windDirection}
            - Tide: ${tide}
            - Tide Details: ${tideDetails}`;

        const aiReport = await genReport(promptText);

        // Respond with structured JSON
        return res.json({ waveHeight, waveDirection, wind, windDirection, tide, tideTime, aiReport });
    }catch(err){
        console.log("Conditions controller error:", err); 
        res.status(500).json({ error: "Failed to fetch surf conditions"});
    }
}


