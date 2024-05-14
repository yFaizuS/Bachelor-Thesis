const express = require('express');
const router = express.Router();
const checkoutController = require('../controller/checkoutController'); 
const cors = require('../middleware/cors');
const authuser = require('../middleware/authuser');
router.use(cors);
router.post('/add/:id',authuser, checkoutController.addCheckout);
router.post('/remove/:id',authuser, checkoutController.removeCheckout);
router.get('/get',authuser, checkoutController.getCheckout);


module.exports = router;
