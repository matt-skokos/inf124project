const express   = require('express');
const db        = require('../db'); // Firestore instance 
const auth      = require("../middleware/auth")
const ctrl      = require('../controllers/favorites'); 

const router = express.Router();

router.use(auth);  // protect all routes

// GET /api/favorites → { favorites: [ { name, lat, lng }, … ] }
router.get('/', ctrl.getFavorites);

// POST /api/favorites
//  body: { name, lat, lng } → appends a new favorite under favorites/{uid}.locations
router.post('/', ctrl.addFavorite);

router.delete ('/', ctrl.removeFavorite);

module.exports = router;