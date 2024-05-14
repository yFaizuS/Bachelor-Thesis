// models/paymentMethods.js
const { where, query, getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');
const firebase = require('../firebase.js');
const db = getFirestore(firebase);

class paymentMethodModel {
    // static async getAllpaymentMethods() {
    //     const paymentMethodsRef = collection(db, 'paymentMethods');
    //     const snapshot = await getDocs(paymentMethodsRef);
    //     const paymentMethods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    //     return paymentMethods;
    // }
    static async getTitleBypaymentMethodId(paymentMethodId) {
        const paymentMethodDocRef = doc(db, 'paymentMethods', paymentMethodId);
        const paymentMethodDoc = await getDoc(paymentMethodDocRef);
        if (paymentMethodDoc.exists()) {
            return paymentMethodDoc.data().title;
        } else {
            throw new Error('payment Method not found');
        }
    }

    // method to get ID by title
    static async getIdByTitle(title) {
        const paymentMethodsRef = collection(db, 'paymentMethods');
        const q = query(paymentMethodsRef, where('title', '==', title));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            throw new Error('Payment Method not found');
        }
        return snapshot.docs.map(doc => doc.id)[0]; // Assuming title is unique and only one document is expected
    }
    static async getTitleByPaymentId(paymentId) {
        const paymentMethodDocRef = doc(db, 'paymentMethods', paymentId);
        const paymentMethodDoc = await getDoc(paymentMethodDocRef);
        if (paymentMethodDoc.exists()) {
            return paymentMethodDoc.data().title;
        } else {
            throw new Error('Role not found');
        }
    }
}

module.exports = paymentMethodModel;
