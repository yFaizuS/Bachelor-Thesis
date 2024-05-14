// models/appointmentLocation.js
const { where, query, getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');
const firebase = require('../firebase.js');
const db = getFirestore(firebase);

class appointmentLocationModel {
    static async getTitleByAppointmentLocationId(appointmentLocationId) {
        const appointmentLocationDocRef = doc(db, 'appointmentLocations', appointmentLocationId);
        const appointmentLocationDoc = await getDoc(appointmentLocationDocRef);
        if (appointmentLocationDoc.exists()) {
            return appointmentLocationDoc.data().title;
        } else {
            throw new Error('Appointment Location not found');
        }
    }

    // method to get ID by title
    static async getIdByTitle(title) {
        const appointmentLocationRef = collection(db, 'appointmentLocations');
        const q = query(appointmentLocationRef, where('title', '==', title));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            throw new Error('Appointment Location not found');
        }
        return snapshot.docs.map(doc => doc.id)[0];
    }

    static async getTitleByAppointmentLocId(appointmentLocationId) {
        const appointmentLocationDocRef = doc(db, 'appointmentLocations', appointmentLocationId);
        const appointmentLocationDoc = await getDoc(appointmentLocationDocRef);
        if (appointmentLocationDoc.exists()) {
            return appointmentLocationDoc.data().title;
        } else {
            throw new Error('appointment Location not found');
        }
    }
}

module.exports = appointmentLocationModel;
