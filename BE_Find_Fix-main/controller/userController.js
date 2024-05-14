// controller/userController.js
const jwt = require("jsonwebtoken");
const userController = {};
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');
const RoleModel = require('../models/role');

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
    if (password.length < 8 || password === password.toUpperCase() || password === password.toLowerCase() || !/\d/.test(password)) {
      throw new Error("Password invalid");
    }
    // Check if email is already registered
    const isEmailExist = await UserModel.checkEmail(email);

    if (!isEmailExist) {
      throw new Error('Email already registered');
    }
    const roles = await RoleModel.getAllRoles();
    //Default : 1 is Customer 
    const userRole = role ? roles.find(r => r.title === role)?.id || '1' : '1';
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name, // defaults to "" if empty
      phone, // defaults to "" if empty
      address, // defaults to "" if empty
      email,
      password: hashedPassword,
      userRole // Default role is 'customer'
    };

    // Store the user data
    const registeruser = await UserModel.registerUser(userData);
    if (registeruser) {
      // Respond with success if user is created
      res.status(201).json({ code: 201, status: "Created" });
    }
  } catch (error) {
    // Respond with error details
    res.status(400).json({ code: 400, status: "Bad Request", message: error.message });
  }
};



userController.loginUserAuth = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari pengguna berdasarkan email
    const userData = await UserModel.findUserByEmail(email);

    if (!userData) {
      throw new Error('Invalid email or password');
    }

    // Periksa kecocokan password
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Jika password valid, buat token JWT
    const token = jwt.sign({ id: userData.id, email: userData.email }, 'your_secret_key', { expiresIn: '3h' });

    res.status(200).json({ status: 'success', token });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
}

userController.updateUser = async (req, res) => {
  try {
    const id = req.user.id;
    const { name, email, phone, address } = req.body;
    if (email) {
      const isEmailExist = await UserModel.checkEmail(email);
      if (!isEmailExist) {
        throw new Error('Email already in use by another account');
      }

    }
    // Data untuk update
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    // Melakukan update dokumen
    const updateuser = await UserModel.updateUser(id, updateData);
    if (updateuser) {
      // Respond with success if user is updated
      res.json({ code: 200, status: "Success", message: "User updated successfully" });
    }

  } catch (error) {
    res.status(400).json({ code: 400, status: "Bad Request", message: error.message });
  }
};

userController.getProfile = async (req, res) => {
  try {
    // Asumsi ID user diambil dari data user yang sudah terautentikasi (misal, lewat JWT token)
    const id = req.user.id;
    let userData = await UserModel.findUserById(id);

    if (!userData) {
      // Jika dokumen tidak ditemukan, kirim response 404 Not Found
      res.status(400).json({ code: 400, status: "Not Found", message: "User not found" });
    } else {
      delete userData.password; // Hapus password dari data yang dikirim ke client
      const roleTitle = await RoleModel.getTitleByRoleId(userData.roleId);
      userData.role = roleTitle;
      delete userData.roleId;
      res.json({ code: 200, status: "Success", data: userData });
    }
  } catch (error) {
    // Tangani kesalahan yang mungkin terjadi
    res.status(400).json({ code: 400, status: "Bad Request", message: error.message });
  }
};



module.exports = userController;