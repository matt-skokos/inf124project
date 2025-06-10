const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();
const { getPlacePhotoUrls } = require("./locationServices");

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
  console.log(`AI Report: ${aiReport}`);

  return aiReport;
};

/**
 * Generate a list of local surf spots based on the user's location
 * @param {string} location - The user's current location
 * @returns {object} - JSON object containing an array of surf spots
 */
const genLocalSurfSpots = async (location) => {
  try {
    // Create a simple prompt without all the complex formatting
    const prompt = `You are a local surf expert. For the location "${location}", 
    please give me exactly 5 popular surf spots within 50 miles.
    
    Format your response as a valid JSON object with this structure:
    {
      "spots": [
        {
          "name": "Spot Name",
          "description": "Brief 3-4 sentence description of the spot.",
          "difficulty": "Beginner" or "Intermediate" or "Advanced"
        }
      ]
    }`;

    // Use the exact same model and configuration as the working genReport function
    const aiRes = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        response_mime_type: "application/json",
        systemInstruction: "You are a surf expert. Return valid JSON only.",
        maxOutputTokens: 800,
        temperature: 0.35, // Match the working temperature
      },
    });

    const responseText = aiRes.text;
    console.log(
      `Raw surf spots response: ${responseText.substring(0, 100)}...`
    );

    // Parse the response
    try {
      // Clean up any markdown formatting that might be in the response
      const cleanedResponse = responseText
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();

      // Try to parse the JSON
      const result = JSON.parse(cleanedResponse);

      // Validate the structure
      if (!result || !Array.isArray(result.spots)) {
        throw new Error("Invalid response structure from AI");
      }

      // For each spot, fetch photo URLs
      console.log("Fetching photos for each surf spot...");
      for (const spot of result.spots) {
        try {
          // Use the spot name to get photos
          const searchQuery = `${spot.name} surf spot ${location}`;
          console.log(`Fetching photos for: ${searchQuery}`);

          const photoUrls = await getPlacePhotoUrls(searchQuery, 400, 400);
          console.log(`Found ${photoUrls.length} photos for ${spot.name}`);

          // Store up to 3 photo URLs with the spot
          spot.photoUrls = photoUrls.slice(0, 3).map((photo) => photo.url);
        } catch (photoError) {
          console.error(`Error fetching photos for ${spot.name}:`, photoError);
          spot.photoUrls = []; // Empty array if no photos found
        }
      }

      return result;
    } catch (parseError) {
      console.error("Error parsing JSON from Gemini response:", parseError);
      console.error("Failed to parse text:", responseText);

      // Return empty spots array
      return { spots: [] };
    }
  } catch (err) {
    console.error("Error generating local surf spots:", err);
    return { spots: [] };
  }
};

module.exports = { genReport, genLocalSurfSpots };
