import { useState, useEffect } from "react"; 

const API_URL = process.env.REACT_APP_API_URL

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
                    case "overview":
                    default:
                        resp = await fetch(`${API_URL}/conditions?loc=${location}&lat=${lat}&lng=${lng}`); 
                }
                if(!resp.ok){
                    const errorData = await resp.json(); 
                    throw new Error(`Conditions fetch error (${resp.status}): ${JSON.stringify(errorData)}`); 
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
    }, [location, lat, lng, measurement]); 
    return {conditions, loading, error}
}