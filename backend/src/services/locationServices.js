const fetch = require("node-fetch")

const GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json";

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

module.exports = { reverseGeocode }