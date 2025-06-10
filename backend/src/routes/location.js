const express = require("express");
const ctrl = require("../controllers/location");
const router = express.Router();
const cacheControl = require("../middleware/cacheControl");

// Apply cache middleware to all routes in this router
router.use(cacheControl());

// Debug endpoint for testing
router.get("/test", ctrl.testEndpoint);

// Regular routes
router.get("/", ctrl.GetLocation);
router.get("/ip", ctrl.getLocationIP);
router.get("/coords", ctrl.getCoords);
router.get("/nearby", ctrl.getNearby);
router.get("/photos", ctrl.getPlacesPhotos);
router.get("/surfspots", ctrl.getLocalSurfSpots);

module.exports = router;
