import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL

export function useNearbyPlaces(lat, lng, maxResults){
    const [places, setPlaces] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    useEffect(() => {
        if( lat == null || lng == null){
            setLoading(true); 
            return; 
        }

        const fetchNearby = async () => {
            try{
                const query = "beach";
                const resp = await fetch(`${API_URL}/location/nearby?query=${query}&lat=${lat}&lng=${lng}&maxResults=${maxResults}`);
                if(!resp.ok){
                    throw new Error(`Conditions fetch error: ${resp.status}`); 
                }
                const data = await resp.json();
                setPlaces(data.places);
            }catch(err){
                setError(err.message); 
            }finally{
                setLoading(false);
            }
        }

        fetchNearby();
    }, [lat, lng, maxResults])
    return{ places, loading, error };
}