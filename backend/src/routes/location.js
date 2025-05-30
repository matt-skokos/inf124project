const ctrl = require('../controllers/location')
const express = require("express");
const router = express.Router(); 

router.get("/", ctrl.GetLocation); // From explicit coords to get town/neighborhood
router.get("/ip", ctrl.getLocationIP) // Fallback

module.exports = router;