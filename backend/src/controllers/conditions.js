const fetch =  require("node-fetch");
const { GoogleGenAI  } = require("@google/genai");
const { NWSWeatherConditions, NOAATideCurrentConditions, NDBCBouyConditions } = require("../services/conditionsServices")
require('dotenv').config(); 


const gcpApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: gcpApiKey });

exports.getConditions = async (req, res) => {
    const { lat, lng } = req.query; 
    if(!lat || !lng){
        return res.status(400).json({ error: "Missing required query parameters: lat, lng" });
    }

    try{

        const { conditionDetails, windDirection, wind } = await NWSWeatherConditions(lat, lng);
        const { tide, tideDetails} = await NOAATideCurrentConditions(lat,lng); 
        const { bouyId } = await NDBCBouyConditions(lat, lng);

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
