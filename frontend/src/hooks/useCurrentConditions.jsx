import { useState, useEffect } from "react"; 

const API_URL = process.env.REACT_APP_API_URL

export function useCurrentConditions(lat, lng, measurement=""){
    const [conditions, setConditions] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    console.log(`Call useCurrentConditions; (${lat}, ${lng}) ${measurement}`);

    useEffect(() => {
        console.log(`useEffect Start`);
        // Only attempt to fetch once lat/lng is fetched
        if( lat == null || lng == null){
            console.log(`lat/lng check`);
            setError("Missing latitude or longitude."); 
            setLoading(true); 
            return; 
        }
        console.log(`Pass lat/lng check`);

        const fetchConditions = async () => {
            setLoading(true); 
            setError(null); 

            try{
                let resp = ""; 
                switch (measurement){
                    case "wave":
                        resp = await fetch(`${API_URL}/conditions/wave?lat=${lat}&lng=${lng}`); 
                        break;
                    case "wind":
                        resp = await fetch(`${API_URL}/conditions/wind?lat=${lat}&lng=${lng}`); 
                        break;
                    case "tide":
                        resp = await fetch(`${API_URL}/conditions/tide?lat=${lat}&lng=${lng}`); 
                        break;
                    default:
                        resp = await fetch(`${API_URL}/conditions?lat=${lat}&lng=${lng}`); 

                }
                
                if(!resp.ok){
                    throw new Error(`Conditions fetch error: ${resp.status}`); 
                }
                const data = await resp.json(); 
                setConditions(data);
            } catch(err){
                setError(err.message); 
            }finally{
                setLoading(false); 
            }
        }
        fetchConditions();
    }, [lat, lng, measurement]); 
    return {conditions, loading, error}
}