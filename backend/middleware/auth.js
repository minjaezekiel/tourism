// middleware/auth.js

const jwt = require('jsonwebtoken');

// --- Middleware to check if user is authenticated ---
const isAuthenticated = async (req, res, next) => {
  // Get the token from the 'Authorization' header
  // The header format is typically "Bearer <token>"
  const authHeader = req.header('Authorization');

  // Check if the token exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user payload to the request object
    // We will add a 'user' property to the request
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    // If the token is invalid or expired
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// --- Middleware to check if the authenticated user is an admin ---
const isAdmin = (req, res, next) => {
  // First, ensure the user is authenticated
  isAuthenticated(req, res, () => {
    // Now, check if the user's role is admin
    if (req.user && req.user.isAdmin) {
      // If the user is an admin, proceed to the next handler
      next();
    } else {
      // If the user is not an admin, deny access
      res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }
  });
};

module.exports = { isAuthenticated, isAdmin };