const { GoogleGenAI  } = require("@google/genai");
require('dotenv').config(); 

const gcpApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: gcpApiKey });

const genConditionOverview = async (prompt) => {

    const aiRes = await ai.models.generateContent({
        model: "gemini-2.0-flash", 
        contents: prompt,
        config: {
            systemInstruction: "You are a professional broadcast meteorologist.",
        },
    }); 
    const aiOverview = aiRes.text;
    console.log(`AI Overview: ${aiOverview}`)
    
    return aiOverview;
}

module.exports = { genConditionOverview }