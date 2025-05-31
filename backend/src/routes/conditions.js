const ctrl = require("../controllers/conditions")
const express = require("express"); 
const router = express.Router(); 

router.get('/', ctrl.getConditions);

module.exports = router
