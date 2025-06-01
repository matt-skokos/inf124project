const fetch =  require("node-fetch");
const { reverseGeocode } = require("../services/locationServices");
const { CACHE_TTL } = require("../utils");

const GEOLOCATION_URL = "https://www.googleapis.com/geolocation/v1/geolocate";

// Get name of user's location from lat-lng
exports.GetLocation = async(req,res) => {
    const {lat, lng} = req.query; 
    if(!lat || !lng) return res.status(400).json({error: "Missing coords"}); 

    try{
        const location = await reverseGeocode(lat,lng); 
        
        // Respond with structured JSON
        res.set('Cache-Control', `public, max-age= ${CACHE_TTL}`); // Set Browser HTTP Cache
        res.json({ location });
    }catch(err){
        console.error("reverseGeocode error:", err);
        const err_status = err.status || 500; 
        res.status(err_status).json({error: `Geocoding failed: ${err}`});
    }
}

// Get name of user's location from IP address
exports.getLocationIP = async (req,res) => {
    try{
        // Google Geolocation
        const url = `${GEOLOCATION_URL}?key=${process.env.GEOSERVICES_API_KEY}`
        const geoRes = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ considerIp: true }),
            headers: { "Content-Type": "application/json" }
        });
        const geoJson = await geoRes.json();
        
        if(!geoRes.ok || geoJson.error){
            console.warn("Google Geolocation error:", geoJson.error);
            return res
                .status(geoJson.error?.code || 502)
                .json({ error: geoJson.error?.message || "Geolocation API failed" });
        }
        
        const {location: geoLoc} = geoJson;
        const location = await reverseGeocode(geoLoc.lat, geoLoc.lng);
        
        // Respond with structured JSON
        res.set('Cache-Control', `public, max-age= ${CACHE_TTL}`); // Set Browser HTTP Cache
        return res.json({lat: geoLoc.lat, lng: geoLoc.lng, location}); 
    }catch(err){
        console.log(err);
        res.status(500).json({error: `Geocoding failed ${err}}`})
    }
}