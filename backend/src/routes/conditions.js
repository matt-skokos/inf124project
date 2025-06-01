const express = require("express"); 
const ctrl = require("../controllers/conditions")
const router = express.Router(); 
const cacheControl = require("../middleware/cacheControl")

router.use(cacheControl());

router.get('/', ctrl.getConditionsOverview);
router.get('/wave', ctrl.getWaveConditions);
router.get('/wind', ctrl.getWindConditions);
router.get('/tide', ctrl.getTideConditions);

module.exports = router
