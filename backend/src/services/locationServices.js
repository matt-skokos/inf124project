const fetch = require("node-fetch")
const { normalize } = require("../utils");
const GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const PLACES_NEARBY_SEARCH_URL="https://places.googleapis.com/v1/places:searchNearby";

// In‐memory cache: normalized query → { lat, lng } */
const inMemoryCache = new Map();

const reverseGeocode = async (lat, lng) => {
        const url = `${GEOCODING_URL}?latlng=${lat},${lng}&key=${process.env.GEOSERVICES_API_KEY}`
        const res = await fetch(url);
        if(!res.ok){
            throw new Error(`Geocoding API returned ${res.status}`);
        }

        const {results} = await res.json(); 
        const loc = results.find(r=> r.types.includes("locality") || r.types.includes("neighborhood"))
        return loc?.formatted_address || "Unknown place"; 
}

const placesTextSearch = async (query) => {
    if (!query) throw new Error("Missing query for Places Text Search");
    
    const res = await fetch(PLACES_TEXT_SEARCH_URL, {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.GEOSERVICES_API_KEY,
            "X-Goog-FieldMask": "places.location", // We only need the places.location field back
        }, 
        body: JSON.stringify({
            "textQuery": query
        }),
    });
    if (!res.ok) {
        throw new Error(`Places Text Search returned HTTP ${res.status}`);
    }
    
    const json = await res.json();
    if (!Array.isArray(json.places) || json.places.length === 0) {
        console.log(JSON.stringify(json))
        throw new Error(`Places(new) found no results for "${query}".`);
    }

    const { latitude: lat, longitude: lng } = json.places[0].location
    return { lat, lng };
}

const placesTextSearchPhotos = async (query) => {
    if (!query) throw new Error("Missing query for Places Text Search");
    
    const res = await fetch(PLACES_TEXT_SEARCH_URL, {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.GEOSERVICES_API_KEY,
            "X-Goog-FieldMask": "places.photos.name,places.photos.widthPx,places.photos.heightPx", // We only need the geometry.photos field back
        }, 
        body: JSON.stringify({
            "textQuery": query
        }),
    });
    if (!res.ok) {
        throw new Error(`Places Text Search returned HTTP ${res.status}`);
    }
    
    const json = await res.json();
    if (!Array.isArray(json.places) || json.places.length === 0) {
        console.log(JSON.stringify(json))
        throw new Error(`Places(new) found no results for "${query}".`);
    }

    const photos = json.places[0].photos;
    return photos;
}

const getPlacePhotoUrls = async (query, maxWidthPx = 400, maxHeightPx = 400) => {
  const photos = await placesTextSearchPhotos(query);
  if (!Array.isArray(photos) || photos.length === 0) {
    return [];
  }

  // 2. Map each photo.name → full GET URL
  //    https://places.googleapis.com/v1/{photo.name}/media
  //      ?key=YOUR_API_KEY
  //      &maxWidthPx=...
  //      &maxHeightPx=...
  return photos.map(({ name, widthPx, heightPx }) => {
    const baseMediaUrl = `https://places.googleapis.com/v1/${name}/media`;
    const url = new URL(baseMediaUrl);
    url.searchParams.set("key", process.env.GEOSERVICES_API_KEY);
    url.searchParams.set("maxWidthPx", String(maxWidthPx));
    url.searchParams.set("maxHeightPx", String(maxHeightPx));
    
    // We return an array of objects { url, widthPx, heightPx }
    return {
      url: url.toString(),
      originalWidth: widthPx,
      originalHeight: heightPx,
    };
  });
};

const nearbyPlaces = async (query, lat, lng, maxResultCount) => {
    const res = await fetch(PLACES_NEARBY_SEARCH_URL, {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.GEOSERVICES_API_KEY,
            "X-Goog-FieldMask": "places.formattedAddress,places.location,places.addressComponents.shortText", // We only need the geometry.location field back
        }, 
        body: JSON.stringify({
            "includedTypes": [query],
            "maxResultCount": maxResultCount,
            "locationRestriction": {
                "circle": {
                "center": {
                    "latitude": lat,
                    "longitude": lng},
                "radius": 50000.0
                }
            }
        }),
    })
    if (!res.ok) {
        throw new Error(`Places(new) Nearby search returned HTTP ${res.status}`);
    }

    const json = await res.json();
    if (!Array.isArray(json.places) || json.places.length === 0) {
        console.log(JSON.stringify(json))
        throw new Error(`Places(new) found no results for "${query}".`);
    }
    return json;
}

const classicGeocode = async (query) => {
    if (!query) throw new Error("Missing query for Geocode search");

    const url = `${GEOCODING_URL}?address=${query}&key=${process.env.GEOSERVICES_API_KEY}`
    const res = await fetch(url);
    if(!res.ok){
        throw new Error(`Geocoding API returned ${res.status}`);
    }

    const geoJson = await res.json(); 
    if(geoJson.status !== "OK" || !Array.isArray(geoJson.results) || geoJson.results.lenth === 0){
        throw new Error( `No results from Geocoding API for address: ${query}`); 
    }

    const{ lat, lng } = geoJson.results[0].geometry.location; 
    return {lat, lng}; 
}

const geocode = async (query) =>{
    if (!query) throw new Error("Missing address in geocode()");
    
    const key = normalize(query);
    const encodedQuery = encodeURIComponent(key);

    // In-memory cache
    if (inMemoryCache.has(key)){
        console.log(`Found query in-memory: "${key}"`);
        return inMemoryCache.get(key);
    }

    // Try Places Text Search raw
    try{
        const coords = await placesTextSearch(key);
        inMemoryCache.set(key, coords)
        console.log(`Success: Places Text Search returned location coordinates for "${key}"`);
        return coords; 
    }catch(err){
        console.warn(`placesTextSearch(raw) failed for "${query}": ${err.message}`);
    }

    // Fallback to classic geocoding –––
    try {
        const fallback = await classicGeocode(encodedQuery);
        inMemoryCache.set(key, fallback);
        console.log(`Success: Geocode API returned location coordinates for "${key}"`);
        return fallback;
    } catch(err){
        console.warn(`geocoding search("${query}") failed: ${err.message}`);
    }
}

module.exports = { reverseGeocode, geocode, nearbyPlaces, getPlacePhotoUrls}