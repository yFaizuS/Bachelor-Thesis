// routes/itemRoutes.js
const express = require('express');
const userController = require('../controller/userController');
const cors = require('../middleware/cors');
const router = express.Router();
const authuser = require('../middleware/authuser');


router.use(cors);
//endpoint register
router.post('/register', userController.registerUser);
//endpoint login
router.post('/login', userController.loginUserAuth);
router.post('/update',authuser, userController.updateUser);
router.get('/profile',authuser, userController.getProfile);
module.exports = router;