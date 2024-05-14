const express = require('express');
const cors = require('../middleware/cors');
const router = express.Router();
const multer = require('multer');
const authuser = require('../middleware/authuser');
const providerController = require('../controller/providerController');
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limiting files size to 5 MB
  },
});

router.use(cors);
router.post('/add', uploader.single('image'), providerController.createProvider);
router.get('/get/:id', providerController.getProviderById);

module.exports = router;
