// controllers/user.controls.js
require("dotenv").config()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./../models/users.js'); // Adjust path if needed

// --- Function to handle user registration ---
const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, username, email, password } = req.body;
 
    // 1. Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists.' });
    }

    // 2. Create a new user
    // The pre-save hook in your model will automatically hash the password
    const user =  User.create({
      first_name,
      last_name,
      username,
      email,
      password,
      isAdmin: false // Default to false unless explicitly set
    });

    // 3. Save the user to the database
    //await user.save();n

    // 4. Respond with success (don't send back the password)
    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// --- Function to handle user login ---
const loginUser = async (req, res) => {

  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' }); // Generic error for security
    }

    // 2. Compare the provided password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Either email or password is incorrect' }); 
      
      // Generic error for security
    }

    // 3. If credentials are correct, create a JWT payload
    const payload = {
      id: user._id,
      isAdmin: user.isAdmin 
      // Include role in the token
    };
//console.log(user.isAdmin)
    // 4. Sign the token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
                             
// Token expires in 30 days
    );

    
    console.log(token)

  
    // 5. Send the token back to the client
    res.status(200).json({
      message: 'Login successful!',
      token: token,
      
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Example of a protected route controller ---
const getUserProfile = async (req, res) => {
  // The 'isAuthenticated' middleware will have already run and attached the user to req.user
  try {
    // We find the user by ID from the token, but exclude the password field
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};