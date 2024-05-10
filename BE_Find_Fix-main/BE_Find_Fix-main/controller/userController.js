// controller/userController.js
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userController = {};
const fs = require("fs");
const bcrypt = require('bcryptjs');
const firebase = require('../firebase.js');
const { getFirestore, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } = require('firebase/firestore');

const db = getFirestore(firebase);

//register
userController.registerUser = async (req, res) => {
  try {
    // Destructuring with default values for name, phone, and address if they are falsy
    const {
      name = "",
      phone = "",
      address = "",
      email,
      password,
      role
    } = req.body;

    // Validate password strength
    let valid = true;
    if (password.length < 8 || password === password.toUpperCase() || password === password.toLowerCase() || !/\d/.test(password)) {
      valid = false;
    }

    // Check if email is already registered
    const userRef = collection(db, 'users');
    const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

    if (!querySnapshot.empty) {
      throw new Error('Email already registered');
    }

    // Check for valid password
    if (!valid) {
      throw new Error("Password invalid");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name, // defaults to "" if empty
      phone, // defaults to "" if empty
      address, // defaults to "" if empty
      email,
      password: hashedPassword,
      role: role || 'customer' // Default role is 'customer'
    };

    // Store the user data
    await addDoc(collection(db, 'users'), userData);

    // Respond with success if user is created
    res.status(200).json({ code: 200, status: "Created" });
  } catch (error) {
    // Respond with error details
    res.status(400).json({ code: 400, status: "Bad Request", message: error.message });
  }
};



userController.loginUserAuth = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Cari pengguna berdasarkan email
    const userRef = collection(db, 'users');
    const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

    if (querySnapshot.empty) {
      throw new Error('Invalid email or password');
    }

    // Ambil data pengguna pertama dari hasil pencarian
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Periksa kecocokan password
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Jika password valid, buat token JWT
    const token = jwt.sign({ id: userDoc.id, email: userData.email }, 'your_secret_key', { expiresIn: '1h' });

    res.status(200).json({ status: 'success', token });
  } catch (error) {
    res.status(401).json({ status: 'error', message: error.message });
  }
}

userController.updateUser = async (req, res) => {
  try {
    const id  = req.user.id;
    const { name, email, phone, address } = req.body;
    // Opsi: Cek apakah email sudah terdaftar pada user lain
    const userRef = collection(db, 'users');
    if(email){
      const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));
      querySnapshot.forEach((doc) => {
        if (doc.id !== id) {
          throw new Error('Email already in use by another account');
        }
      });
    }

    // Membuat referensi ke dokumen user spesifik
    const userDocRef = doc(db, 'users', id);
    
    // Data untuk update
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    // Melakukan update dokumen
    await updateDoc(userDocRef, updateData);

    res.json({ code: 200, status: "Success", message: "User updated successfully" });
  } catch (error) {
    res.status(400).json({ code: 400, status: "Bad Request", message: error.message });
  }
};

userController.getProfile = async (req, res) => {
  try {
    // Asumsi ID user diambil dari data user yang sudah terautentikasi (misal, lewat JWT token)
    const id = req.user.id;

    // Membuat referensi ke dokumen user spesifik
    const userDocRef = doc(db, 'users', id);

    // Mengambil dokumen user
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      // Jika dokumen tidak ditemukan, kirim response 404 Not Found
      res.status(404).json({ code: 404, status: "Not Found", message: "User not found" });
    } else {
      // Jika dokumen ditemukan, kembalikan data user
      // Opsional: Menghapus atau menyembunyikan field sensitif seperti password sebelum mengirim response
      let userData = docSnap.data();
      delete userData.password; // Hapus password dari data yang dikirim ke client
      
      res.json({ code: 200, status: "Success", data: userData });
    }
  } catch (error) {
    // Tangani kesalahan yang mungkin terjadi
    res.status(400).json({ code: 400, status: "Bad Request", message: error.message });
  }
};



module.exports = userController;