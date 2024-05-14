// models/status.js
const { where, query, getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');
const firebase = require('../firebase.js');
const db = getFirestore(firebase);

class StatusModel {
    static async getAllStatus() {
        const statusRef = collection(db, 'status');
        const snapshot = await getDocs(statusRef);
        const status = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return status;
    }
    static async getTitleByStatusId(statusId) {
        const statusDocRef = doc(db, 'status', statusId);
        const statusDoc = await getDoc(statusDocRef);
        if (statusDoc.exists()) {
            return statusDoc.data().title;
        } else {
            throw new Error('Status not found');
        }
    }
    static async getIdByTitle(title) {
        const statusDocRef = collection(db, 'status');
        const q = query(statusDocRef, where('title', '==', title));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            throw new Error('Status  not found');
        }
        return snapshot.docs.map(doc => doc.id)[0]; // Assuming title is unique and only one document is expected
    }
}

module.exports = StatusModel;
