import { useState, useEffect } from "react"; 
import API from "../api";

export function useSurfConditions(lat, lng, measurement="", location=""){
    const [conditions, setConditions] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    useEffect(() => {
        // Only attempt to fetch once lat/lng is fetched
        if( lat == null || lng == null){
            setLoading(true); 
            return; 
        }
        
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone       // e.g. “America/Los_Angeles”
        const offset   = new Date().getTimezoneOffset() // minutes *behind* UTC (PDT → 420)
        console.log(`timezone - ${timezone}`);
        console.log(`offset - ${offset}`);

        const fetchConditions = async () => {
            setLoading(true); 
            setError(null); 

            try{
                let resp = "";
                switch (measurement){
                    case "wave":
                        resp = await API.get('/conditions/wave', { params: { lat, lng, loc: location, timezone, offset } });
                        break;
                    case "wind":
                        resp = await API.get('/conditions/wind', { params: { lat, lng, loc: location, timezone, offset } });
                        break;
                    case "tide":
                        resp = await API.get('/conditions/tide', { params: { lat, lng, loc: location, timezone, offset } });
                        break;
                    case "overview":
                    default:
                        resp = await API.get('/conditions', { params: { lat, lng, loc: location, timezone, offset } });
                }
                setConditions(resp.data);
            } catch(err){
                console.error(err.message)
                setError(err.message); 
            }finally{
                setLoading(false); 
            }
        }
        fetchConditions();
    }, [location, lat, lng, measurement]); 
    return {conditions, loading, error}
}