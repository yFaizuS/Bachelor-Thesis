const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');
const cors = require('../middleware/cors');
const authuser = require('../middleware/authuser');
const multer = require('multer');
const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // limiting files size to 5 MB
    },
});
router.use(cors);
router.post('/add', authuser, orderController.createOrder);
router.post('/status/:id', authuser, orderController.updateOrderStatus);
router.post('/updateAppointment/:id', authuser, orderController.updateOrderAppointmentDateTime);
router.get('/getall', authuser, orderController.getAllOrders);
router.get('/get/:id', authuser, orderController.getOrderById);
router.post('/uploadPaymentReceipt/:id', uploader.single('image'), authuser, orderController.uploadPaymentReceipt);
router.post('/updateSpareParts/:id', authuser, orderController.addSparePartsToOrder);
module.exports = router;
