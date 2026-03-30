require("dotenv").config();
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
// ✅ ADDED Sequelize to get access to Op.or
const { User, sequelize, Sequelize } = require('../models/models');

// --- Register User ---
const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
      isAdmin: false
    });

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error("❌ REGISTER ERROR:", error);
    res.status(500).json({ 
      message: 'Server error during registration.',
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// --- Login User ---
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body; // 'username' here acts as email OR username

    console.log(`\n🔑 LOGIN ATTEMPT -> Input: "${username}"`);

    if (!username || !password) {
      console.log("❌ FAILED: Missing username or password");
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // ==========================================
    // ✅ MAGIC FIX: Allow Email OR Username
    // ==========================================
    const searchCondition = username.includes('@') 
      ? { email: username }      // Search email column if they typed an @
      : { username: username };  // Search username column otherwise

    const user = await User.findOne({ 
      where: searchCondition,
      attributes: { include: ['password'] } 
    });
    
    if (!user) {
      console.log(`❌ FAILED: Account "${username}" not found in database.`);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    console.log(`👤 USER FOUND -> ID: ${user.id}, Hash: ${user.password.substring(0, 15)}...`);

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log(`❌ FAILED: Password does not match.`);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ FATAL: JWT_SECRET is missing in .env file");
      throw new Error("Server configuration error: Missing JWT Secret");
    }

    const payload = {
      id: user.id,
      isAdmin: user.isAdmin
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log(`✅ LOGIN SUCCESSFUL -> Token generated (Admin: ${user.isAdmin})`);
    console.log("--------------------------------------------------\n");

    res.status(200).json({
      message: 'Login successful!',
      token: token
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    res.status(500).json({ 
      message: 'Server error during login.',
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// --- Get User Profile ---
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } 
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ PROFILE ERROR:", error);
    res.status(500).json({ 
      message: 'Server error fetching profile.',
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};