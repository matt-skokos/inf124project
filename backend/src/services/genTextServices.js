const { GoogleGenAI  } = require("@google/genai");
require('dotenv').config(); 

const gcpApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: gcpApiKey });

const genReport = async (prompt) => {

    const aiRes = await ai.models.generateContent({
        model: "gemini-2.0-flash", 
        contents: prompt,
        config: {
            systemInstruction: `You are a senior broadcast meteorologist and experienced surfer.
                Do not use special characters in reponse.`,
            maxOutputTokens: 200,
            temperature: 0.35,
        },
    }); 
    const aiReport = aiRes.text;
    console.log(`AI Report: ${aiReport}`)
    
    return aiReport;
}

module.exports = { genReport }