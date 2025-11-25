// routes/user.routes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/user.controls');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// --- Public Routes (no authentication needed) ---

// Route for user registration
// POST /api/users/register
router.post('/register', registerUser);

// Route for user login
// POST /api/users/login
router.post('/login', loginUser);


// --- Protected Routes (authentication required) ---

// Route to get the logged-in user's profile
// GET /api/users/profile
// We apply the 'isAuthenticated' middleware to protect this route
router.get('/profile', isAuthenticated, getUserProfile);


// --- Admin-Only Routes (authentication + admin role required) ---

// Example of an admin-only route
// GET /api/users/admin/dashboard
// We apply both middlewares. The order matters: check auth, then check role.
router.get('/admin/dashboard', isAuthenticated, isAdmin, (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin dashboard!' });
});


module.exports = router;