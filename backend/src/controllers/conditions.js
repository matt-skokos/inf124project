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
    const { lat, lng } = req.query; 
    if(!lat || !lng){
        return res.status(400).json({ error: "Missing required query parameters: lat, lng" });
    }
    
    try{
        const {tide, tideTime, tideDetails} = await NOAATideConditions(lat,lng);
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
        const promptText = `Based on the following surf conditions and forecast data, respond ONLY with a JSON object with two fields:
- recommendation: a concise statement (e.g., "Sunday morning is the best time.").
- explanation: a 2-3 sentence explanation of why, using the data provided.

Data:
- Location: ${location}
- Wave Height: ${waveHeight} ft
- Wave Direction: ${waveDirection}
- Weather Predictions: ${JSON.stringify(weatherPredictions)}
- Tide Predictions: ${JSON.stringify(tidePredictions)}
`;
        console.log(promptText);
        const aiResponseRaw = await genReport(promptText);
        let aiResponse = aiResponseRaw;
        let aiReport;
        try {
            aiResponse = aiResponse.replace(/```json|```/g, '').trim();
            aiReport = JSON.parse(aiResponse);
        } catch (e) {
            aiReport = {
                recommendation: "No recommendation available.",
                explanation: aiResponseRaw
            };
        }
        return res.json(aiReport);

    }catch(err){
        console.log("Conditions controller error:", err); 
        res.status(500).json({ error: "Failed to fetch surf preductions"});
    }
}

exports.getConditionsOverview = async (req, res) => {
    const { loc: location, lat, lng } = req.query; 
    if(!lat || !lng){
        return res.status(400).json({ error: "Missing required query parameters: lat, lng" });
    }
    if(!location){
        return res.status(400).json({ error: "Missing required query parameter: 'loc' for location name" });
    }

    try{
        let { waveHeight, waveDirection }               = await NDBCBuoyConditions(lat, lng);
        const { conditionDetails, windDirection, wind } = await NWSWeatherConditions(lat, lng);
        const { tide, tideTime, tideDetails}            = await NOAATideConditions(lat,lng); 

        waveHeight = metersToFeet(waveHeight).toFixed(1);
        waveDirection = degreesToDirection(waveDirection);

        // Generate a natural-language overview via GCP Generative Langauge API
        const promptText = `Based on the following surf conditions and forecast data, respond ONLY with a JSON object with two fields:
- recommendation: a concise statement (e.g., "Sunday morning is the best time.").
- explanation: a 2-3 sentence explanation of why, using the data provided.

Data:
- Location: ${location}
- Wave Height: ${waveHeight} ft
- Wave Direction: ${waveDirection}
- Wind: ${wind}
- Wind Direction: ${windDirection}
- Tide: ${tide}
- Tide Details: ${tideDetails}
`;
        const aiResponseRaw = await genReport(promptText);
        let aiResponse = aiResponseRaw;
        let aiReport;
        try {
            aiResponse = aiResponse.replace(/```json|```/g, '').trim();
            aiReport = JSON.parse(aiResponse);
        } catch (e) {
            aiReport = {
                recommendation: "No recommendation available.",
                explanation: aiResponseRaw
            };
        }
        // Respond with structured JSON
        return res.json({ waveHeight, waveDirection, wind, windDirection, tide, tideTime, ...aiReport });
    }catch(err){
        console.log("Conditions controller error:", err); 
        res.status(500).json({ error: "Failed to fetch surf conditions"});
    }
}


