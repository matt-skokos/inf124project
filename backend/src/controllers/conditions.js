const fetch =  require("node-fetch");
const { GoogleGenAI  } = require("@google/genai");
const { NWSWeatherConditions, NOAATideCurrentConditions, NDBCBuoyConditions } = require("../services/conditionsServices")
require('dotenv').config(); 

const gcpApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: gcpApiKey });

exports.getConditions = async (req, res) => {
    const { lat, lng } = req.query; 
    if(!lat || !lng){
        return res.status(400).json({ error: "Missing required query parameters: lat, lng" });
    }

    const metersToFeet = (meters) => {
        return meters * 3.28084;
    }

    const degreesToDirection = (degree) => {
        const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]; 
        degrees = degree % 360
        index = Math.round(degree / 22.5) % 16
        return directions[index];
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
        return res.json({ waveHeight, waveDirection, wind, windDirection, tide, tideDetails, aiOverview });
    }catch(err){
        console.log("Conditions service error: " , err); 
        res.status(500).json({ error: "Failed to fetch surf conditions"});
    }
}
