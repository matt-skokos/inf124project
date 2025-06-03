const fetch = require("node-fetch")
const { normalize } = require("../utils");
const GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const PLACES_TEXT_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"; 

// In‐memory cache: normalized query → { lat, lng } */
const inMemoryCache = new Map();

const reverseGeocode = async (lat, lng) => {
        const url = `${GEOCODING_URL}?latlng=${lat},${lng}&key=${process.env.GEOSERVICES_API_KEY}`
        const res = await fetch(url);
        if(!res.ok){
            throw new Error(`Geocoding API returned ${res.status}`);
        }

        const {results} = await res.json(); 
        const loc = results.find(r=> r.types.includes("locality") || r.types.includes("neighborhood"))
        return loc?.formatted_address || "Unknown place"; 
}

const placesTextSearch = async (query) => {
    if (!query) throw new Error("Missing query for Places Text Search");
    
    const url = `${PLACES_TEXT_SEARCH_URL}?query=${query}&key=${process.env.GEOSERVICES_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Places Text Search returned HTTP ${res.status}`);
    }
    
    const json = await res.json();
    if (json.status !== "OK" || !Array.isArray(json.results) || json.results.length === 0) {
        throw new Error(`No Places results for "${query}". Status: ${json.status}`);
    }

    const { lat, lng } = json.results[0].geometry.location;
    return { lat, lng };
}

const classicGeocode = async (query) => {
    if (!query) throw new Error("Missing query for Geocode search");

    const url = `${GEOCODING_URL}?address=${query}&key=${process.env.GEOSERVICES_API_KEY}`
    const res = await fetch(url);
    if(!res.ok){
        throw new Error(`Geocoding API returned ${res.status}`);
    }

    const geoJson = await res.json(); 
    if(geoJson.status !== "OK" || !Array.isArray(geoJson.results) || geoJson.results.lenth === 0){
        throw new Error( `No results from Geocoding API for address: ${query}`); 
    }

    const{ lat, lng } = geoJson.results[0].geometry.location; 
    return {lat, lng}; 
}

const geocode = async (query) =>{
    if (!query) throw new Error("Missing address in geocode()");
    
    const key = normalize(query);
    const encodedQuery = encodeURIComponent(key);

    // In-memory cache
    if (inMemoryCache.has(key)){
        console.log(`Found query in-memory: "${key}"`);
        return inMemoryCache.get(key);
    }

    // Try Places Text Search raw
    try{
        const coords = await placesTextSearch(encodedQuery);
        inMemoryCache.set(key, coords)
        console.log(`Success: Places Text Search returned location coordinates for "${key}"`);
        return coords; 
    }catch(err){
        console.warn(`placesTextSearch(raw) failed for "${query}": ${err.message}`);
    }

    // Fallback to classic geocoding –––
    try {
        const fallback = await classicGeocode(encodedQuery);
        inMemoryCache.set(key, fallback);
        console.log(`Success: Geocode API returned location coordinates for "${key}"`);
        return fallback;
    } catch(err){
        console.warn(`geocoding search("${query}") failed: ${err.message}`);
    }

}

module.exports = { reverseGeocode, geocode }