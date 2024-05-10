const { getFirestore, collection, addDoc, doc, getDoc, setDoc, updateDoc,deleteDoc  } = require('firebase/firestore');
const firebase = require('../firebase.js');
// Inisialisasi Firestore
const db = getFirestore(firebase);

const checkoutController = {};

checkoutController.getCheckout = async (req, res) => {
    try {
        const id = req.user.id; // User ID from request, assuming middleware sets req.user
        const checkoutDocRef = doc(db, 'checkout', id);
        const docSnap = await getDoc(checkoutDocRef);

        if (!docSnap.exists()) {
            // If no document exists for the given ID, send a 404 response
            return res.status(404).json({ code: 404, status: "Not Found", message: "No checkout information found for this user." });
        } else {
            // Gather details of each service in the checkout
            const checkoutServices = docSnap.data().services;
            let enrichedServices = [];
            let grandTotal = 0;

            for (const service of checkoutServices) {
                const serviceDocRef = doc(db, 'services', service.serviceid);
                const serviceDoc = await getDoc(serviceDocRef);
                if (!serviceDoc.exists()) {
                    continue; // Skip if service details not found (consider error handling here)
                }
                const serviceData = serviceDoc.data();
                const totalPrice = service.quantity * serviceData.price;
                grandTotal += totalPrice;

                enrichedServices.push({
                    serviceid: service.serviceid,
                    title: serviceData.title,
                    imageUrl: serviceData.imageUrl,
                    price: serviceData.price,
                    quantity: service.quantity,
                    totalPrice: totalPrice
                });
            }

            // Return the checkout data with additional service details and grand total
            return res.status(200).json({
                code: 200,
                status: "Success",
                data: {
                    services: enrichedServices,
                    grandTotal: grandTotal
                }
            });
        }
    } catch (error) {
        // Handle any errors that might occur during the database access
        return res.status(500).json({ code: 500, status: "Internal Server Error", message: error.message });
    }
};

checkoutController.addCheckout = async (req, res) => {
    try {
        const id = req.user.id;
        const serviceid = req.params.id;
        const checkoutDocRef = doc(db, 'checkout', id);
        const docSnap = await getDoc(checkoutDocRef);

        if (!docSnap.exists()) {
            const newCheckoutData = {
                services: [
                    { serviceid: serviceid, quantity: 1 }
                ]
            };
            await setDoc(checkoutDocRef, newCheckoutData);
            return res.status(200).json({ code: 200, status: "Checkout Created", message: "New checkout has been created." });
        } else {
            const existingServices = docSnap.data().services;
            let serviceExists = false;
            const updatedServices = existingServices.map(service => {
                if (service.serviceid === serviceid) {
                    serviceExists = true;
                    return { ...service, quantity: service.quantity + 1 };
                }
                return service;
            });
            if (!serviceExists) {
                updatedServices.push({ serviceid: serviceid, quantity: 1 });
            }
            await updateDoc(checkoutDocRef, { services: updatedServices });
            return res.status(200).json({ code: 200, status: "Checkout Updated", message: "Checkout has been updated successfully." });
        }

    } catch (error) {
        return res.status(500).json({ code: 500, status: "Internal Server Error", message: error.message });
    }
};

checkoutController.removeCheckout = async (req, res) => {
    try {
        const id = req.user.id; // User ID from request
        const serviceid = req.params.id; // Service ID from request parameters
        const checkoutDocRef = doc(db, 'checkout', id);
        const docSnap = await getDoc(checkoutDocRef);

        if (!docSnap.exists()) {
            // If no document exists, it means there's nothing to remove
            return res.status(404).json({ code: 404, status: "Not Found", message: "Checkout does not exist." });
        } else {
            const existingServices = docSnap.data().services;
            const updatedServices = existingServices.reduce((acc, service) => {
                if (service.serviceid === serviceid) {
                    // Reduce the quantity by 1
                    const newQuantity = service.quantity - 1;
                    if (newQuantity > 0) {
                        // If quantity is still greater than 0, keep it in the array
                        acc.push({ ...service, quantity: newQuantity });
                    }
                    // If newQuantity is 0, do not push it back to array (thus removing it)
                } else {
                    // Keep all other services as they are
                    acc.push(service);
                }
                return acc;
            }, []);

            // If the updated services array is empty, delete the document
            if (updatedServices.length === 0) {
                await deleteDoc(checkoutDocRef);
                return res.status(200).json({ code: 200, status: "Checkout Deleted", message: "Checkout has been completely removed." });
            } else {
                // Otherwise, update the checkout document with the new array of services
                await updateDoc(checkoutDocRef, { services: updatedServices });
                return res.status(200).json({ code: 200, status: "Checkout Updated", message: "Service updated or removed successfully." });
            }
        }
    } catch (error) {
        return res.status(500).json({ code: 500, status: "Internal Server Error", message: error.message });
    }
};


module.exports = checkoutController;
