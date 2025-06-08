const express = require("express"); 
const ctrl = require("../controllers/conditions")
const router = express.Router(); 
const cacheControl = require("../middleware/cacheControl")

// router.use(cacheControl(5*60));

router.get('/', ctrl.getConditionsOverview);
router.get('/prediction', ctrl.getPredictionOverview);

router.get('/wave', ctrl.getWaveConditions);
router.get('/wind', ctrl.getWindConditions);
router.get('/windpredictions', ctrl.getWindPredictions);
router.get('/tide', ctrl.getTideConditions);
router.get('/tidepredictions', ctrl.getTidePredictions);

module.exports = router
