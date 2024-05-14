// models/order.js
const { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where, arrayUnion } = require('firebase/firestore');
const { getStorage, ref, uploadString, uploadBytes, getDownloadURL } = require('firebase/storage');
const firebase = require('../firebase.js');
const db = getFirestore(firebase);
const storage = getStorage(firebase);
class OrderModel {
    static async getServiceOrders(serviceId) {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('serviceId', '==', serviceId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.id);
    }
    // Model to add Order
    static async addOrder(orderData) {
        try {
            // Add a new document with a generated ID to the 'orders' collection
            const docRef = addDoc(collection(db, 'orders'), orderData);
            // Return the document ID of the newly created orders
            return docRef;
        } catch (error) {
            // Handle any errors that might occFur during the document creation
            //console.error("Error adding orders: ", error);
            throw new Error("Failed to add orders");
        }
    }
    //method to update the status of an order by orderId
    static async updateStatusByOrderId(orderId, newStatus) {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { statusId: newStatus });
        return { orderId, newStatus }; // Optionally return updated information for confirmation
    }
    // Method to fetch all orders
    static async getAllOrders() {
        const ordersCollection = collection(db, "orders");
        const snapshot = await getDocs(ordersCollection);
        const orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return orders;
    }
    static async getAllOrdersbyUserId(id) {
        try {
            const ordersCollection = collection(db, "orders");
            const ordersQuery = query(ordersCollection, where("userId", "==", id));
            const snapshot = await getDocs(ordersQuery);
            const orders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return orders;
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            throw error; // Rethrow or handle as needed
        }
    }
    static async getOrderById(orderId) {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);
        if (!orderSnap.exists()) {
            return null;
        }
        return { id: orderSnap.id, ...orderSnap.data() };
    }
    //Model to Find Order By Id
    static async findOrderById(id) {
        const orderDocRef = doc(db, 'orders', id);
        const docSnap = await getDoc(orderDocRef);
        if (!docSnap.exists()) {
            return null;
        } else {
            return orderDocRef;
        }
    }
    // Method to update orderTime and orderDate by orderId
    static async updateOrderTimeDate(orderId, orderTime, orderDate) {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, {
            orderTime: orderTime,
            orderDate: orderDate,
            statusId: "1"
        });
        return { orderId, updatedTime: orderTime, updatedDate: orderDate }; // Optionally return updated info for confirmation
    }
    // Model to uploadPaymentReceipt
    static async uploadPaymentReceipt(docRef, imageFile) {
        try {
            const imageRef = ref(storage, `orders/${docRef.id}/image.jpg`);
            const imageSnapshot = await uploadBytes(imageRef, imageFile.buffer);
            const paymentReceiptUrl = await getDownloadURL(imageSnapshot.ref);

            // Update FFirestore document with the image URL
            await updateDoc(docRef, { paymentReceiptUrl });

            return true;
        }
        catch (error) {
            console.log(error);
            // Handle any errors that might occFur during the document update
            throw new Error("Failed to upload Payment Receipt");
        }
    }
    static async addSparePartsToOrder(orderId, spareParts) {
        try {
            const orderRef = doc(db, 'orders', orderId);
            const orderSnap = await getDoc(orderRef);
            if (!orderSnap.exists()) {
                throw new Error('Order not found');
            }
            let currentOrder = orderSnap.data();

            // Calculate the total price of the new spare parts
            const newTotalPriceSparePart = spareParts.reduce((sum, part) => sum + (part.price * part.quantity), 0);

            // Calculate grand total price
            const newGrandTotalPrice = (currentOrder.totalPrice || 0) + newTotalPriceSparePart;

            // Update the order with new spare parts, updated spare parts total price, and grand total price
            await updateDoc(orderRef, {
                spareParts: spareParts,
                totalPriceSparePart: newTotalPriceSparePart,
                grandTotalPrice: newGrandTotalPrice
            });

            return { orderId, addedSpareParts: spareParts, newTotalPriceSparePart, newGrandTotalPrice };
        }
        catch (error) {
            console.log(error);
            // Handle any errors that might occFur during the document update
            throw new Error("Failed to Update Sparepart");
        }
    }
}

module.exports = OrderModel;
