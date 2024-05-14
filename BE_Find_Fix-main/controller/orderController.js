const OrderModel = require('../models/order');
const ServiceModel = require('../models/service');
const paymentMethodModel = require('../models/paymentMethod');
const appointmentLocationModel = require('../models/appointmentLocation');
const StatusModel = require('../models/status');
const RoleModel = require('../models/role');
const UserModel = require('../models/user');
const ReviewModel = require('../models/review');

const orderController = {};

// Membuat Pesanan Baru
orderController.createOrder = async (req, res) => {
    try {
        // Extracting text fields from the request body
        const { name, serviceId, address, phone, orderTime, orderDate, paymentMethod, appointmentLoc } = req.body;
        const userId = req.user.id;
        const price = await ServiceModel.getPriceByServiceId(serviceId);
        const paymentMethodId = await paymentMethodModel.getIdByTitle(paymentMethod);
        const appointmentLocid = await appointmentLocationModel.getIdByTitle(appointmentLoc);
        // Add order data to Firestore
        const orderData = {
            userId,
            serviceId,
            name,
            address,
            phone,
            totalPrice: price,
            GrandTotalPrice: price,
            orderTime,
            orderDate,
            paymentId: paymentMethodId,
            appointmentLocId: appointmentLocid,
            statusId: "1", // Default status = "Waiting"
            sparepart: []
        };

        await OrderModel.addOrder(orderData);
        res.status(200).json({ code: 200, status: "Order Created" });

    } catch (error) {
        res.status(400).json({ code: 400, status: "Internal Server Error", message: error.message });
    }
};

orderController.updateOrderStatus = async (req, res) => {
    try {
        const id = req.user.id;
        const orderId = req.params.id;
        const { status } = req.body;

        let userData = await UserModel.findUserById(id);

        if (!userData) {
            // Jika dokumen tidak ditemukan, kirim response 404 Not Found
            res.status(400).json({ code: 400, status: "Not Found", message: "User not found" });
        } else {
            delete userData.password; // Hapus password dari data yang dikirim ke client
            const roleTitle = await RoleModel.getTitleByRoleId(userData.roleId);
            userData.role = roleTitle;
            delete userData.roleId;
        }
        if (userData.role == "admin") {
            // Validate that the new status is acceptable
            const statusId = await StatusModel.getIdByTitle(status);
            await OrderModel.updateStatusByOrderId(orderId, statusId);

            res.status(200).json({ code: 200, status: "OK", message: "Order status updated successfully." });
        }
        else {
            return res.status(400).json({ code: 400, status: "Bad Request", message: "Invalid status provided." });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ code: 400, status: "Internal Server Error", message: error.message });
    }
};

// Mendapatkan Daftar Pesanan
orderController.getAllOrders = async (req, res) => {
    try {
        const id = req.user.id;
        let userData = await UserModel.findUserById(id);
        if (!userData) {
            // Jika dokumen tidak ditemukan, kirim response 404 Not Found
            res.status(400).json({ code: 400, status: "Not Found", message: "User not found" });
        } else {
            delete userData.password; // Hapus password dari data yang dikirim ke client
            const roleTitle = await RoleModel.getTitleByRoleId(userData.roleId);
            userData.role = roleTitle;
            delete userData.roleId;
        }
        let orders;
        if (userData.role == "admin") {
            orders = await OrderModel.getAllOrders();
        }
        else {
            orders = await OrderModel.getAllOrdersbyUserId(id);
        }
        if (orders.length === 0) {
            res.status(200).json({ code: 200, status: "No Content", message: "No orders found" });
        } else {
            // Enhance each order with service details
            const enhancedOrders = await Promise.all(orders.map(async (order) => {
                if (order.serviceId) {
                    const serviceData = await ServiceModel.getServiceById(order.serviceId);
                    if (serviceData) {
                        order.serviceTitle = serviceData.title;
                        order.serviceImageUrl = serviceData.imageUrl;
                    }
                    if (order.statusId == 5) {
                        const reviewData = await ReviewModel.getReviewByOrderId(order.id);
                        order.rating = reviewData?.rating ?? 0;
                        order.review = reviewData?.review ?? "";
                    }
                    const paymentTitle = await paymentMethodModel.getTitleByPaymentId(order.paymentId);
                    order.payment = paymentTitle;
                    delete order.paymentId;
                    const statusTitle = await StatusModel.getTitleByStatusId(order.statusId);
                    order.status = statusTitle;
                    delete order.statusId;
                    const AppointmentLocTitle = await appointmentLocationModel.getTitleByAppointmentLocId(order.appointmentLocId);
                    order.AppointmentLoc = AppointmentLocTitle;
                    delete order.appointmentLocId;
                }
                return order;
            }));
            res.status(200).json({ code: 200, status: "OK", orders: enhancedOrders });
        }
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(400).json({ code: 400, status: "Internal Server Error", message: error.message });
    }
};

// Mengambil Detail Pesanan Berdasarkan ID
orderController.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await OrderModel.getOrderById(orderId);

        if (!order) {
            res.status(400).json({ code: 400, status: "Not Found", message: "Order not found" });
            return;
        }

        // Retrieve additional service details if serviceId exists
        if (order.serviceId) {
            const serviceData = await ServiceModel.getServiceById(order.serviceId);
            if (serviceData) {
                order.serviceTitle = serviceData.title;  // Add service title
                order.serviceImageUrl = serviceData.imageUrl;  // Add service image URL
            }
            if (order.statusId == 5) {
                const reviewData = await ReviewModel.getReviewByOrderId(orderId);
                order.rating = reviewData?.rating ?? 0;
                order.review = reviewData?.review ?? "";
            }
            const paymentTitle = await paymentMethodModel.getTitleByPaymentId(order.paymentId);
            order.payment = paymentTitle;
            delete order.paymentId;
            const statusTitle = await StatusModel.getTitleByStatusId(order.statusId);
            order.status = statusTitle;
            delete order.statusId;
            const AppointmentLocTitle = await appointmentLocationModel.getTitleByAppointmentLocId(order.appointmentLocId);
            order.AppointmentLoc = AppointmentLocTitle;
            delete order.appointmentLocId;
        }

        res.status(200).json({ code: 200, status: "OK", order: order });
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        res.status(400).json({ code: 400, status: "Internal Server Error", message: error.message });
    }
};

// update Order Appointment Date Time
orderController.updateOrderAppointmentDateTime = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { orderTime, orderDate } = req.body; // Extracting new timing from request body

        // Validate input
        if (!orderTime || !orderDate) {
            res.status(400).json({ code: 400, status: "Bad Request", message: "Both orderTime and orderDate are required." });
            return;
        }

        const updatedOrder = await OrderModel.updateOrderTimeDate(orderId, orderTime, orderDate);
        res.status(200).json({ code: 200, status: "OK", updatedOrder });
    } catch (error) {
        console.error("Error updating order timing:", error);
        res.status(400).json({ code: 400, status: "Internal Server Error", message: error.message });
    }
};

orderController.uploadPaymentReceipt = async (req, res) => {
    try {
        const orderId = req.params.id;
        // The image file will be in req.file due to multer
        const imageFile = req.file;
        const docRef = await OrderModel.findOrderById(orderId);
        let paymentReceipturl = null;
        // Upload image to Firebase Storage if it exists
        if (imageFile) {
            paymentReceipturl = await OrderModel.uploadPaymentReceipt(docRef, imageFile);
        }
        if (paymentReceipturl) {
            res.status(200).json({ code: 200, status: "Payment Receipt Uploaded" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, status: "Bad Request", message: error.message });
    }
};

orderController.addSparePartsToOrder = async (req, res) => {
    const id = req.user.id;
    const orderId = req.params.id;
    const { spareParts } = req.body; // spareParts should be an array of { name, price, quantity }
    let userData = await UserModel.findUserById(id);

    if (!userData) {
        // Jika dokumen tidak ditemukan, kirim response 404 Not Found
        res.status(400).json({ code: 400, status: "Not Found", message: "User not found" });
    } else {
        delete userData.password; // Hapus password dari data yang dikirim ke client
        const roleTitle = await RoleModel.getTitleByRoleId(userData.roleId);
        userData.role = roleTitle;
        delete userData.roleId;
    }
    if (userData.role == "admin") {
        if (!spareParts || !Array.isArray(spareParts) || spareParts.length === 0) {
            res.status(400).json({ code: 400, status: "Bad Request", message: "Invalid spare parts data provided." });
            return;
        }

        // Validate each spare part item structure
        if (!spareParts.every(sp => sp.name && typeof sp.price === 'number' && typeof sp.quantity === 'number')) {
            res.status(400).json({ code: 400, status: "Bad Request", message: "Each spare part must include name, price, and quantity." });
            return;
        }

        await OrderModel.addSparePartsToOrder(orderId, spareParts);
        res.status(200).json({ code: 200, status: "Add Spareparts Successful" });
    }
    else {
        return res.status(400).json({ code: 400, status: "Bad Request", message: "Invalid status provided." });
    }
};

module.exports = orderController;