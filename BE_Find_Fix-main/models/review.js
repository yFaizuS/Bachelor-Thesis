// models/review.js
const { query, where, getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc } = require('firebase/firestore');
const { getStorage, ref, uploadString, uploadBytes, getDownloadURL } = require('firebase/storage');
const firebase = require('../firebase.js');
const db = getFirestore(firebase);
const storage = getStorage(firebase);
class ReviewModel {
    // Model to add review
    static async addReview(reviewData) {
        try {
            // Add a new document with a generated ID to the 'reviews' collection
            const docRef = addDoc(collection(db, 'reviews'), reviewData);
            // Return the document ID of the newly created reviews
            return docRef;
        } catch (error) {
            // Handle any errors that might occFur during the document creation
            //console.error("Error adding review: ", error);
            throw new Error("Failed to add review");
        }
    }
    static async getRatingByOrderIds(orderIds) {
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, where('orderId', 'in', orderIds));
        const snapshot = await getDocs(q);
        let totalRating = 0;
        snapshot.docs.forEach(doc => {
            totalRating += doc.data().rating;
        });
        return {
            averageRating: snapshot.empty ? 0 : totalRating / snapshot.docs.length,
            totalReviews: snapshot.docs.length
        };
    }

    static async getReviewsByOrderIds(orderIds) {
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, where('orderId', 'in', orderIds));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    static async getReviewByOrderId(orderId) {
        const reviewsRef = collection(db, "reviews");
        const q = query(reviewsRef, where("orderId", "==", orderId));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            return null; // Return null if no review is found for the orderId
        }
        const reviewDoc = snapshot.docs[0];
        return { id: reviewDoc.id, ...reviewDoc.data() };
    }
}

module.exports = ReviewModel;
