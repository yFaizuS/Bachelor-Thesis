const { getDoc,doc,getFirestore, collection, addDoc, updateDoc ,getDocs, query,where} = require('firebase/firestore');
const { getStorage, ref, uploadString,uploadBytes,getDownloadURL } = require('firebase/storage');
// Inisialisasi Firebase

const firebase = require('../firebase.js');
const db = getFirestore(firebase);
const storage = getStorage(firebase);

const serviceController = {};

serviceController.createService = async (req, res) => {
  try {
    // Extracting text fields from the request body
    const { title,provider, description, price,address } = req.body;
    // The image file will be in req.file due to multer
    const imageFile = req.file;
    // Add service data to Firestore
    const servicesCollection = collection(db, "services");
    const docRef = await addDoc(servicesCollection, {
      title,
      provider,
      description,
      price,
      address,
      //imageUrl: "", // Placeholder for the image URL, will update after upload
    });

    // Upload image to Firebase Storage if it exists
    if (imageFile) {
      const imageRef = ref(storage, `services/${docRef.id}/image.jpg`);
      const imageSnapshot = await uploadBytes(imageRef, imageFile.buffer);
      const imageUrl = await getDownloadURL(imageSnapshot.ref);

      // Update Firestore document with the image URL
      await updateDoc(docRef, { imageUrl });
    }

    res.status(200).json({ code: 200, status: "Created", serviceId: docRef.imageUrl });
    // res.status(400).json({ code: 400, status: "Bad Request", message: "halo" });
  } catch (error) {
    res.status(400).json({ code: 400, status: "Bad Request", message: error.message });
  }
};


serviceController.getAllServices = async (req, res) => {
  try {
    const servicesCollection = collection(db, "services");
    const snapshot = await getDocs(servicesCollection);

    // Inisialisasi array untuk menampung promises
    const servicesPromises = snapshot.docs.map(async (doc) => {
      const serviceId = doc.id;

      // Query untuk semua orders yang terkait dengan service ini
      const ordersQuery = query(collection(db, "orders"), where("serviceId", "==", serviceId));
      const ordersSnapshot = await getDocs(ordersQuery);

      let totalRating = 0;
      let count = 0;

      ordersSnapshot.forEach((orderDoc) => {
        if (orderDoc.data().rating) {
          totalRating += orderDoc.data().rating;
          count++;
        }
      });

      const averageRating = count > 0 ? totalRating / count : 0; // Hitung rata-rata atau tetapkan null jika tidak ada rating

      // Mengembalikan objek service dengan rata-rata rating
      return { id: serviceId, ...doc.data(), rating: averageRating };
    });

    // Menunggu semua promise selesai
    const servicesList = await Promise.all(servicesPromises);

    res.status(200).json({ code: 200, status: "OK", services: servicesList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, status: "Internal Server Error", message: error.message });
  }
};


serviceController.getServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const serviceDocRef = doc(db, "services", serviceId);
    const docSnap = await getDoc(serviceDocRef);

    if (!docSnap.exists()) {
      res.status(404).json({ code: 404, status: "Not Found", message: "Service not found" });
    } else {
      // Query semua order yang memiliki serviceId ini
      const ordersQuery = query(collection(db, "orders"), where("serviceId", "==", serviceId));
      const querySnapshot = await getDocs(ordersQuery);

      let totalRating = 0;
      let count = 0;

      querySnapshot.forEach((doc) => {
        if (doc.data().rating) {
          totalRating += doc.data().rating;
          count++;
        }
      });

      const averageRating = count > 0 ? (totalRating / count) : 0;

      // Mengirim respons dengan data service dan rata-rata rating
      res.status(200).json({
        code: 200,
        status: "OK",
        service: { id: docSnap.id, ...docSnap.data(), rating: averageRating }
      });
    }
  } catch (error) {
    res.status(500).json({ code: 500, status: "Internal Server Error", message: error.message });
  }
};


module.exports = serviceController;