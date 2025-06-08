import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

export function useUserLocation() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // flips to clase on cleanup

    const fallbackToIP = () => {
      fetch(`${API_URL}/location/ip`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setLat(data.lat);
          setLng(data.lng);
          setLocationName(data.location);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Unable to determine location");
          setLoading(false);
        });
    };

    if (isMounted) {
      // Try browser Geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            fetch(
              `${API_URL}/location?lat=${coords.latitude}&lng=${coords.longitude}`
            )
              .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
              })
              .then((data) => {
                setLat(coords.latitude);
                setLng(coords.longitude);
                setLocationName(data.location);
                setLoading(false);
              })
              .catch((err) => {
                console.warn(err);
                fallbackToIP();
              });
          },
          () => {
            // User denied or timed out
            fallbackToIP();
          },
          { timeout: 10000 }
        );
      } else {
        // no browser support -> fallback
        fallbackToIP();
      }
    }

    return () => {
      isMounted = false; // stop future setState calls
    };
  }, []);

  return { lat, lng, locationName, loading, error };
}
