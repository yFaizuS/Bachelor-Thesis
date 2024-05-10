const express = require('express');
const cors = require('../middleware/cors');
const router = express.Router();
const multer = require('multer');
const authuser = require('../middleware/authuser');
const serviceController = require('../controller/serviceController');
const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // limiting files size to 5 MB
    },
  });
  
router.use(cors);
router.post('/add', uploader.single('image'), serviceController.createService);
router.get('/getall', serviceController.getAllServices);
router.get('/get/:id', serviceController.getServiceById);

module.exports = router;
