const express = require("express");
const ctrl = require('../controllers/location')
const router = express.Router(); 
const cacheControl = require("../middleware/cacheControl")

router.use(cacheControl());

router.get("/", ctrl.GetLocation); // From explicit coords to get town/neighborhood
router.get("/ip", ctrl.getLocationIP); // Fallback
router.get("/coords", ctrl.getCoords);
router.get("/nearby", ctrl.getNearby);
router.get("/photos", ctrl.getPlacesPhotos);

module.exports = router;