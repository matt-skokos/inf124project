import { useState, useEffect } from "react"; 

const API_URL = process.env.REACT_APP_API_URL

export function useCurrentConditions(lat, lng){
    const [conditions, setConditions] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    useEffect(() => {
        // Only attempt to fetch once lat/lng is fetched
        if( lat == null || lng == null){
            setError("Missing latitude or longitude."); 
            setLoading(true); 
            return; 
        }

        const fetchConditions = async () => {
            setLoading(true); 
            setError(null); 

            try{
                const resp = await fetch(`${API_URL}/conditions?lat=${lat}&lng=${lng}`); 
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
    }, [lat, lng]); 
    return {conditions, loading, error}
}