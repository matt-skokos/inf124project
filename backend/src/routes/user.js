// src/routes/user
const express = require('express'); 
const router = express.Router(); 
const ctrl = require('../controllers/user'); 
const auth = require("../middleware/auth")

// Public: user creation 
router.post('/new', ctrl.createUser); 

// Private: ALL other user routes require valid Firebase ID token
router.use(auth); 

router.get('/', ctrl.listUsers);
router.get('/:id', ctrl.getUser); 
router.put('/:id', ctrl.updateUser); 
router.delete('/:id', ctrl.deleteUser);

module.exports = router;