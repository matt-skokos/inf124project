import {useState, useEffect} from "react"; 

const API_URL = process.env.REACT_APP_API_URL

export function useUserLocation(){
    const [locationName, setLocationName] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {

        const fallbackToIP = () => {
            fetch(`${API_URL}/location/ip`)
                .then(res => {
                    if(!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    setLocationName(data.location); 
                    setLoading(false); 
                })
                .catch( err => {
                    console.error(err); 
                    setError("Unable to determine location"); 
                    setLoading(false);
                })
        } 



        // Try browser Geolocation API
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    fetch(`${API_URL}/location?lat=${coords.latitude}&lng=${coords.longitude}`)
                        .then(res => {
                            if(!res.ok) throw new Error(`HTTP ${res.status}`);
                            return res.json();
                        })
                        .then(data => {
                            setLocationName(data.location);
                            setLoading(false);
                        })
                        .catch(err => {
                            console.warn(err);
                            fallbackToIP();
                        });
                },
                () => {
                    // User denied or timed out
                    fallbackToIP();
                },
                { timeout: 10000}
            );
        }else{
            // no browser support -> fallback
            fallbackToIP();
        }    
    }, []);

    return { locationName, loading, error };
}

