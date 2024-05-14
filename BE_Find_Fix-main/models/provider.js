// models/provider.js
const { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc } = require('firebase/firestore');
const { getStorage, ref, uploadString, uploadBytes, getDownloadURL } = require('firebase/storage');
const firebase = require('../firebase.js');
const db = getFirestore(firebase);
const storage = getStorage(firebase);
class ProviderModel {
    // Model to Register Provider
    static async registerProvider(providerData) {
        try {
            // Add a new document with a generated ID to the 'providers' collection
            const docRef = addDoc(collection(db, 'providers'), providerData);
            // Return the document ID of the newly created providers
            return docRef;
        } catch (error) {
            console.log(error)
            // Handle any errors that might occFur during the document creation
            //console.error("Error adding providers: ", error);
            throw new Error("Failed to register providers");
        }
    }
    // Model to Store imageUrl
    static async storeimageUrl(docRef, imageFile) {
        try {
            const imageRef = ref(storage, `providers/${docRef.id}/image.jpg`);
            const imageSnapshot = await uploadBytes(imageRef, imageFile.buffer);
            const imageUrl = await getDownloadURL(imageSnapshot.ref);

            // Update Firestore document with the image URL
            await updateDoc(docRef, { imageUrl });

            return true;
        }
        catch (error) {
            console.log(error)
            // Handle any errors that might occFur during the document update
            throw new Error("Failed to Store imageUrl");
        }
    }

    static async getProviderDataById(providerId) {
        const providerRef = doc(db, 'providers', providerId);
        const providerSnap = await getDoc(providerRef);
        if (!providerSnap.exists()) {
            throw new Error('Provider not found');
        }
        // Assuming the document contains fields like 'title' and 'address'
        const providerData = providerSnap.data();
        return {
            title: providerData.title,
            address: providerData.address
        };
    }
    static async getProviderById(providerId) {
        const providerRef = doc(db, 'providers', providerId);
        const providerSnap = await getDoc(providerRef);
        if (!providerSnap.exists()) {
            return null; // Return null if no provider is found
        }
        return { id: providerSnap.id, ...providerSnap.data() }; // Return provider data
    }
}

module.exports = ProviderModel;
