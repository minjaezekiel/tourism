// middleware/auth.js
const jwt = require('jsonwebtoken');

// --- Auth middleware ---
const isAuthenticated = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, isAdmin }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// --- Admin-only middleware ---
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin === true) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admin rights required.' });
};

module.exports = { isAuthenticated, isAdmin };
