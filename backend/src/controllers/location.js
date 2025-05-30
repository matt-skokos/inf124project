const fetch =  require("node-fetch");
const { reverseGeocode } = require("../service/locationService");

const GEOLOCATION_URL = "https://www.googleapis.com/geolocation/v1/geolocate";

exports.GetLocation = async(req,res) => {
    const {lat, lng} = req.query; 
    if(!lat || !lng) return res.status(400).json({error: "Missing coords"}); 

    try{
        const location = await reverseGeocode(lat,lng); 
        res.json({ location });
    }catch(err){
        console.error("reverseGeocode error:", err); 
        res.status(err.status).json({error: `Geocoding failed: ${err}`});
    }
}

exports.getLocationIP = async (req,res) => {
    try{
        // Google Geolocation
        const url = `${GEOLOCATION_URL}?key=${process.env.REACT_APP_FIREBASE_API_KEY}}`
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
        
        return res.json({geoResJson})

        const location = await reverseGeocode(geoLoc.lat, geoLoc.lng);
        return res.json({location}); 
    }catch(err){
        console.log(err); 
        res.status(500).json({error: `Geocoding failed ${err}}`})
    }
}