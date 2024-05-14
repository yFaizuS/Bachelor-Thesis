const express = require('express');
const router = express.Router();
const reviewController = require('../controller/reviewController');
const cors = require('../middleware/cors');
const authuser = require('../middleware/authuser');
router.use(cors);
router.post('/add/:id', authuser, reviewController.createReview);
module.exports = router;
