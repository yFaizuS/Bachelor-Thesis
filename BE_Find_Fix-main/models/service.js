// models/service.js
const { getDoc, doc, getFirestore, collection, addDoc, updateDoc, getDocs, query, where } = require('firebase/firestore');
const { getStorage, ref, uploadString, uploadBytes, getDownloadURL } = require('firebase/storage');
const firebase = require('../firebase.js');
const db = getFirestore(firebase);
const storage = getStorage(firebase);
class ServiceModel {
    // Model to Register Service
    static async registerService(serviceData) {
        try {
            // Add a new document with a generated ID to the 'services' collection
            const docRef = addDoc(collection(db, 'services'), serviceData);
            // Return the document ID of the newly created services
            return docRef;
        } catch (error) {
            // Handle any errors that might occFur during the document creation
            //console.error("Error adding services: ", error);
            throw new Error("Failed to register services");
        }
    }
    //Model to Find Service By Id
    static async findServiceById(id) {
        // Membuat referensi ke dokumen user spesifik
        const serviceDocRef = doc(db, 'services', id);
        // Mengambil dokumen user
        const docSnap = await getDoc(serviceDocRef);
        if (!docSnap.exists()) {
            return null;
        } else {
            return serviceDocRef;
        }
    }

    // Model to Store imageUrl
    static async storeimageUrl(docRef, imageFile) {
        try {
            const imageRef = ref(storage, `services/${docRef.id}/image.jpg`);
            const imageSnapshot = await uploadBytes(imageRef, imageFile.buffer);
            const imageUrl = await getDownloadURL(imageSnapshot.ref);

            // Update FFirestore document with the image URL
            await updateDoc(docRef, { imageUrl });

            return true;
        }
        catch (error) {
            console.log(error);
            // Handle any errors that might occFur during the document update
            throw new Error("Failed to Store imageUrl");
        }
    }

    // Model to All Services
    static async getAllServices(minPrice = null, maxPrice = null) {
        let servicesQuery = collection(db, "services");

        // Dynamic query construction based on price filters
        if (minPrice !== null && maxPrice !== null) {
            servicesQuery = query(servicesQuery, where('price', '>=', Number(minPrice)), where('price', '<=', Number(maxPrice)));
        } else if (minPrice !== null) {
            servicesQuery = query(servicesQuery, where('price', '>=', Number(minPrice)));
        } else if (maxPrice !== null) {
            servicesQuery = query(servicesQuery, where('price', '<=', Number(maxPrice)));
        }

        const snapshot = await getDocs(servicesQuery);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    // Model to get Service By Id
    static async getServiceById(serviceId) {
        const serviceRef = doc(db, "services", serviceId);
        const serviceSnap = await getDoc(serviceRef);
        if (!serviceSnap.exists()) {
            return null; // Return null if no document exists
        }
        return { id: serviceSnap.id, ...serviceSnap.data() }; // Return service data with ID
    }
    // method to get price by service ID
    static async getPriceByServiceId(serviceId) {
        const serviceRef = doc(db, 'services', serviceId);
        const serviceSnap = await getDoc(serviceRef);
        if (!serviceSnap.exists()) {
            throw new Error('Service not found'); // Service does not exist
        }
        const serviceData = serviceSnap.data();
        return serviceData.price; // Assuming 'price' is stored in the service document
    }

    static async getOpenDateTimeByServiceId(serviceId) {
        const serviceRef = doc(db, 'services', serviceId);
        const serviceDoc = await getDoc(serviceRef);
        if (serviceDoc.exists()) {
            const serviceData = serviceDoc.data();
            return serviceData.openDateTime || []; // Return the openDateTime array or an empty array if not present
        } else {
            throw new Error('Service not found'); // Throw an error if no service is found
        }
    }

    static async getServiceOrderById(serviceId) {
        const serviceRef = doc(db, 'services', serviceId);
        const serviceSnap = await getDoc(serviceRef);
        if (!serviceSnap.exists()) {
            return null;
        }
        return serviceSnap.data();
    }

    static async getServicesByProviderId(providerId) {
        const servicesRef = collection(db, 'services');
        const q = query(servicesRef, where('providerId', '==', providerId));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    static async updateOpenDateTime(serviceId, newOpenDateTime) {
        const serviceRef = doc(db, 'services', serviceId);
        const docSnap = await getDoc(serviceRef);

        if (!docSnap.exists()) {
            throw new Error('Service not found');
        }

        let existingDateTime = docSnap.data().openDateTime || [];
        // Merge logic with openTime sorting within each date
        newOpenDateTime.forEach(newEntry => {
            const existingIndex = existingDateTime.findIndex(edt => edt.openDate === newEntry.openDate);
            if (existingIndex > -1) {
                // Merge time arrays and sort them
                let combinedTimes = new Set([...existingDateTime[existingIndex].openTime, ...newEntry.openTime]);
                existingDateTime[existingIndex].openTime = Array.from(combinedTimes).sort();
            } else {
                // New date, add entry and sort times
                newEntry.openTime = newEntry.openTime.sort();
                existingDateTime.push(newEntry);
            }
        });

        // Sort the merged array by openDate
        existingDateTime.sort((a, b) => new Date(a.openDate) - new Date(b.openDate));

        // Update the document with the sorted openDateTime array
        await updateDoc(serviceRef, {
            openDateTime: existingDateTime
        });

        return { serviceId, openDateTime: existingDateTime };
    }
}

module.exports = ServiceModel;
