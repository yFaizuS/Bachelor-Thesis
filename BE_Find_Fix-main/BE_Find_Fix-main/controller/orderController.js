const { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where } = require('firebase/firestore');
const firebase = require('../firebase.js');
// Inisialisasi Firestore
const db = getFirestore(firebase);

const orderController = {};

// Membuat Pesanan Baru
orderController.createOrder = async (req, res) => {
    try {
        const now = new Date();
        const formattedTimestamp = [
            ('0' + now.getDate()).slice(-2),
            ('0' + (now.getMonth() + 1)).slice(-2),
            now.getFullYear()
        ].join('-') + ' ' + [
            ('0' + now.getSeconds()).slice(-2),
            ('0' + now.getMinutes()).slice(-2),
            ('0' + now.getHours()).slice(-2)
        ].join(':');

        const { orders, address, phone, name } = req.body;
        const userId = req.user.id;
        const checkoutDocRef = doc(db, 'checkout', userId);
        const checkoutDoc = await getDoc(checkoutDocRef);

        if (!checkoutDoc.exists() || !checkoutDoc.data().services || checkoutDoc.data().services.length === 0) {
            return res.status(404).json({ code: 404, status: "Not Found", message: "No checkout information available." });
        }

        let checkoutServices = checkoutDoc.data().services;
        const ordersCollection = collection(db, "orders");
        let responseMessages = [];

        for (const order of orders) {
            const orderServiceId = order.serviceid;
            let serviceEntry = checkoutServices.find(service => service.serviceid === orderServiceId);

            if (!serviceEntry) {
                responseMessages.push({ serviceid: orderServiceId, message: "Service not found in checkout." });
                continue;
            }

            let serviceDocRef = doc(db, "services", orderServiceId);
            let serviceDoc = await getDoc(serviceDocRef);

            if (!serviceDoc.exists()) {
                responseMessages.push({ serviceid: orderServiceId, message: "Service does not exist." });
                continue;
            }

            const serviceData = serviceDoc.data();
            let total = serviceEntry.quantity * serviceData.price;
            let price = serviceData.price;

            const docRef = await addDoc(ordersCollection, {
                userId,
                name,
                phone,
                serviceId: orderServiceId,
                price,
                total,
                quantity: serviceEntry.quantity,
                address,
                status: "Waiting",
                createdAt: formattedTimestamp
            });

            // Remove the service from checkout
            checkoutServices = checkoutServices.filter(service => service.serviceid !== orderServiceId);
        }

        // Update or delete the checkout document based on remaining services
        if (checkoutServices.length > 0) {
            await updateDoc(checkoutDocRef, { services: checkoutServices });
        } else {
            await deleteDoc(checkoutDocRef);
        }

        res.status(200).json({ code: 200, status: "Order Created", messages: responseMessages });

    } catch (error) {
        res.status(500).json({ code: 500, status: "Internal Server Error", message: error.message });
    }
};


// Mendapatkan Daftar Pesanan
orderController.getAllOrders = async (req, res) => {
    try {
        const id = req.user.id;
        const userDocRef = doc(db, 'users', id);
        const docSnap = await getDoc(userDocRef);
        const ordersCollection = collection(db, "orders");
        let userData;
        let roleUser;
        let snapshot;
        if (docSnap.exists()) {
            userData = docSnap.data();
            roleUser = userData.role;
        }
        if (roleUser != "admin") {
            console.log(id);
            const queryConstraint = query(ordersCollection, where("userId", "==", id));
            snapshot = await getDocs(queryConstraint);
        }
        else {
            console.log("admin");
            snapshot = await getDocs(ordersCollection);
        }
        const ordersWithServiceInfoPromises = snapshot.docs.map(async (docSnapshot) => {
            const orderData = docSnapshot.data();
            const serviceId = orderData.serviceId;
            const serviceDocRef = doc(db, "services", serviceId);
            const serviceDocSnap = await getDoc(serviceDocRef);

            if (serviceDocSnap.exists()) {
                const serviceData = serviceDocSnap.data();
                //console.log(...orderData)
                return {
                    id: docSnapshot.id,
                    userId: orderData.userId,
                    name: orderData.name,
                    phone: orderData.phone,
                    price: orderData.price,
                    quantity: orderData.quantity,
                    total: orderData.total,
                    status: orderData.status,
                    serviceId: orderData.serviceId,
                    address: orderData.address,
                    rating: orderData.rating ? orderData.rating : null,
                    createdAt: orderData.createdAt,
                    serviceName: serviceData.title, // Assuming 'title' is stored as 'title'
                    serviceImageUrl: serviceData.imageUrl // Assuming 'imageUrl' is stored as 'imageUrl'
                };
            } else {
                // Return order data without additional service data if not found
                return {
                    id: docSnapshot.id,
                    ...orderData
                };
            }
        });

        // Wait for all promises to resolve
        const ordersList = await Promise.all(ordersWithServiceInfoPromises);

        res.status(200).json({ code: 200, status: "OK", orders: ordersList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, status: "Internal Server Error", message: error.message });
    }
};


// Mengambil Detail Pesanan Berdasarkan ID
orderController.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const orderDocRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(orderDocRef);

        if (!docSnap.exists()) {
            res.status(404).json({ code: 404, status: "Not Found", message: "Order not found" });
        } else {
            const orderData = docSnap.data();
            const serviceId = orderData.serviceId;  // Asalkan setiap order memiliki 'serviceId'
            const serviceDocRef = doc(db, "services", serviceId);
            const serviceDocSnap = await getDoc(serviceDocRef);

            if (serviceDocSnap.exists()) {
                const serviceData = serviceDocSnap.data();
                const orderDetail = {
                    id: docSnap.id,
                    ...orderData,
                    serviceName: serviceData.title,    // asumsi 'title' adalah nama field di service
                    serviceImageUrl: serviceData.imageUrl  // asumsi 'imageUrl' adalah nama field di service
                };
                res.status(200).json({ code: 200, status: "OK", order: orderDetail });
            } else {
                // Jika tidak ada informasi service, kembalikan order tanpa informasi service
                res.status(200).json({ code: 200, status: "OK", order: { id: docSnap.id, ...orderData } });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, status: "Internal Server Error", message: error.message });
    }
};


// Memberikan Rating Pesanan Berdasarkan ID
orderController.rateOrder = async (req, res) => {
    try {
        const orderId = req.params.id; // atau dari req.body tergantung desain API Anda
        const { rating } = req.body;
        // Validasi rating (misalnya harus antara 1 dan 5)
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ code: 400, status: "Bad Request", message: "Rating must be between 1 and 5" });
        }

        const orderDocRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(orderDocRef);

        if (!docSnap.exists()) {
            res.status(404).json({ code: 404, status: "Not Found", message: "Order not found" });
        } else {
            // Update dokumen dengan rating baru
            await updateDoc(orderDocRef, { rating });

            res.status(200).json({ code: 200, status: "OK", message: "Rating updated successfully" });
        }
    } catch (error) {
        res.status(500).json({ code: 500, status: "Internal Server Error", message: error.message });
    }
};
orderController.updateOrderStatus = async (req, res) => {
    try {
        const id = req.user.id;
        const orderId = req.params.id;
        const { status } = req.body;
        const userDocRef = doc(db, 'users', id);
        const docSnapUser = await getDoc(userDocRef);
        let userData;
        let roleUser;
        if (docSnapUser.exists()) {
            userData = docSnapUser.data();
            roleUser = userData.role;
        }
        if (roleUser == "admin") {
            // Validate that the new status is acceptable
            const validStatuses = ['Waiting', 'Accepted', 'In Progress', 'Done'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ code: 400, status: "Bad Request", message: "Invalid status provided." });
            }
            const orderDocRef = doc(db, "orders", orderId);
            const orderDocSnap = await getDoc(orderDocRef);

            if (!orderDocSnap.exists()) {
                return res.status(404).json({ code: 404, status: "Not Found", message: "Order not found." });
            }

            // Update the order status
            await updateDoc(orderDocRef, { status: status });

            res.status(200).json({ code: 200, status: "OK", message: "Order status updated successfully." });
        }
        else {
            return res.status(400).json({ code: 400, status: "Bad Request", message: "Invalid status provided." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, status: "Internal Server Error", message: error.message });
    }
};


module.exports = orderController;