import { useState, useEffect } from "react"; 

const API_URL = process.env.REACT_APP_API_URL

export function useSurfPrediction(location, lat, lng, timeperiod){
    const [prediction, setPrediction] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    useEffect(() => {
        // Only attempt to fetch once lat/lng is fetched
        if( lat == null || lng == null){
            setLoading(true); 
            return; 
        }

        const fetchPrediction = async () => {
            setLoading(true);
            setError(null);
            try{
                const resp = await fetch(`${API_URL}/conditions/prediction?loc=${location}&lat=${lat}&lng=${lng}&timeperiod=${timeperiod}`); 
                if(!resp.ok){
                    const errorData = await resp.json(); 
                    throw new Error(`Conditions fetch error (${resp.status}): ${JSON.stringify(errorData)}`); 
                }
                const data = await resp.json();
                setPrediction(data);
            }catch{
                setError("error");
            }finally{
                setLoading(false);
            }
            return {};
        }

        fetchPrediction();
    }, [location, lat, lng, timeperiod]); 
    return {prediction, loading, error}
}