const fetch = require("node-fetch");
const {
  reverseGeocode,
  geocode,
  nearbyPlaces,
  getPlacePhotoUrls,
} = require("../services/locationServices");
const { genLocalSurfSpots } = require("../services/genTextServices");

const GEOLOCATION_URL = "https://www.googleapis.com/geolocation/v1/geolocate";

// Get name of user's location from lat-lng
exports.GetLocation = async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: "Missing coords" });

  try {
    const location = await reverseGeocode(lat, lng);

    // Respond with structured JSON
    res.json({ location });
  } catch (err) {
    console.error("reverseGeocode error:", err);
    const err_status = err.status || 500;
    res.status(err_status).json({ error: `Geocoding failed: ${err}` });
  }
};

// Get name of user's location from IP address
exports.getLocationIP = async (req, res) => {
  try {
    // Google Geolocation
    const url = `${GEOLOCATION_URL}?key=${process.env.GEOSERVICES_API_KEY}`;
    const geoRes = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ considerIp: true }),
      headers: { "Content-Type": "application/json" },
    });
    const geoJson = await geoRes.json();

    if (!geoRes.ok || geoJson.error) {
      console.warn("Google Geolocation error:", geoJson.error);
      return res
        .status(geoJson.error?.code || 502)
        .json({ error: geoJson.error?.message || "Geolocation API failed" });
    }

    const { location: geoLoc } = geoJson;
    const location = await reverseGeocode(geoLoc.lat, geoLoc.lng);

    // Respond with structured JSON
    return res.json({ lat: geoLoc.lat, lng: geoLoc.lng, location });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Geocoding failed ${err}}` });
  }
};

exports.getCoords = async (req, res) => {
  const { address } = req.query;
  if (!address) {
    return res.status(400).json({ error: "Missing address parameter" });
  }

  try {
    const { lat, lng } = await geocode(address);
    return res.json({ lat, lng });
  } catch (err) {
    console.log("getCoords error:", err);
    return res.status(502).json({ message: "error" });
  }
};

exports.getNearby = async (req, res) => {
  const { query, lat, lng, maxResults } = req.query;
  try {
    const places = await nearbyPlaces(query, lat, lng, maxResults);
    return res.json(places);
  } catch (err) {
    console.log("getNearby error:", err);
    return res.status(502).json({ message: "error" });
  }
};

exports.getPlacesPhotos = async (req, res) => {
  const { loc: location } = req.query;
  if (!location) {
    return res.status(400).json({ error: "Missing 'loc' query parameter" });
  }

  try {
    const maxHeightPx = 500;
    const maxWidthPx = 500;
    const photoUrls = await getPlacePhotoUrls(
      location,
      maxHeightPx,
      maxWidthPx
    );
    res.json(photoUrls);
  } catch (err) {
    console.log("getPlacesPhotos error:", err);
    return res.status(502).json({ message: "error" });
  }
};

exports.getLocalSurfSpots = async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: "Missing location parameter" });
  }

  try {
    console.log(`Getting surf spots for location: ${location}`);
    const result = await genLocalSurfSpots(location);

    // Make sure we have the expected structure
    if (
      !result ||
      !result.spots ||
      !Array.isArray(result.spots) ||
      result.spots.length === 0
    ) {
      console.log("No spots found or invalid response structure");
      return res.json({
        message: "Unable to locate any spots in your current location.",
        spots: [],
      });
    }

    console.log(`Found ${result.spots.length} surf spots for ${location}`);
    return res.json(result);
  } catch (err) {
    console.error("Error in getLocalSurfSpots controller:", err);
    return res.json({
      message: "Unable to locate any spots in your current location.",
      spots: [],
    });
  }
};

// Also add a simple test endpoint
exports.testEndpoint = (req, res) => {
  console.log("Test endpoint called");
  return res.json({ message: "Test endpoint working" });
};
