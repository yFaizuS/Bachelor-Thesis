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
router.post('/add', serviceController.createService);
router.post('/storeiImg/:id', uploader.single('image'), serviceController.storeimageService);
router.get('/getall', serviceController.getAllServices);
router.get('/get/:id', serviceController.getServiceById);
router.get('/getAppointment/:id', serviceController.getAppointmentAvailableById);
router.post('/updateOpenDateTime/:id', authuser, serviceController.updateOpenDateTime);
module.exports = router;
