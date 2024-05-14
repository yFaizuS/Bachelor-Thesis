// models/user.js
const fs = require("fs");
const firebase = require('../firebase.js');
const { getFirestore, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } = require('firebase/firestore');
const db = getFirestore(firebase);

class UserModel {

    // Check if email is already registered
    static async checkEmail(email) {
        const userRef = collection(db, 'users');
        const q = query(userRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        // Mengembalikan boolean berdasarkan apakah dokumen ditemukan
        return querySnapshot.empty;
    }

    // Model to Register User
    static async registerUser(userData) {
        try {
            // Add a new document with a generated ID to the 'users' collection
            await addDoc(collection(db, 'users'), userData);
            // Return the document ID of the newly created user
            return true;
        } catch (error) {
            // Handle any errors that might occFur during the document creation
            //console.error("Error adding user: ", error);
            throw new Error("Failed to register user");
        }
    }
    // Model to Login User
    static async findUserByEmail(email) {
        const userRef = collection(db, 'users');
        const q = query(userRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        } else {
            const userDoc = querySnapshot.docs[0];
            return { id: userDoc.id, ...userDoc.data() };
        }
    }
    // Model to Update User
    static async updateUser(id, updateData) {
        try {
            const userDocRef = doc(db, 'users', id);
            await updateDoc(userDocRef, updateData);
            return true;
        }
        catch (error) {
            // Handle any errors that might occFur during the document update
            //console.error("Error adding user: ", error);
            throw new Error("Failed to Update user");
        }
    }
    static async findUserById(id) {
        // Membuat referensi ke dokumen user spesifik
        const userDocRef = doc(db, 'users', id);
        // Mengambil dokumen user
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) {
            return null;
        } else {
            return docSnap.data();
        }
    }
}

module.exports = UserModel;
