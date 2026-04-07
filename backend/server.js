require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs"); // Added fs for creating directories
const jwt = require("jsonwebtoken");
const multer = require("multer"); // <-- ADDED MULTER

// =======================
// DATABASE & MODELS (Sequelize)
// =======================
const { 
  sequelize,
  Sequelize,
  User,
  Analytics,
  Blog,
  Contact,
  Gallery,
  Testimonial,
  Tour
} = require("./models/models");

const app = express();
const PORT = process.env.PORT || 3000;

console.log("DB USER:", process.env.DB_USER);
console.log("DB NAME:", process.env.DB_NAME);

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// =======================
// MULTER CONFIGURATION (File Uploads)
// =======================
const createStorage = (folderName) => multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "public", "img", folderName);
    // Create folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only images are allowed!'), false);
  }
  cb(null, true);
};

// Create upload middleware for different sections
const uploadTourImage = multer({ storage: createStorage('tours'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadBlogImage = multer({ storage: createStorage('blog_uploads'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadGalleryImage = multer({ storage: createStorage('gallery'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// =======================
// STATIC FILES
// =======================
app.use("/img/gallery", express.static(path.join(__dirname, "public/img/gallery")));
app.use("/img/blog_uploads", express.static(path.join(__dirname, "public/img/blog_uploads")));
app.use("/img/tours", express.static(path.join(__dirname, "public/img/tours")));

// =======================
// AUTH MIDDLEWARE
// =======================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// =======================
// CONTROLLERS
// =======================
const { registerUser, loginUser, getUserProfile } = require("./controllers/user.controls");
const { createContact, getAllContactMessages, getContactMessageById, deleteContactMessage } = require("./controllers/contact.controller");
const { createPost, getAllPosts, getPostById, updatePost, deletePost } = require("./controllers/blog.controller");
const { getGallery, addGalleryImage, deleteGalleryImage } = require("./controllers/gallery.controller");
const { trackVisit, getAnalytics } = require("./controllers/analytics.controller");
const { addTour, getAllTours, getTourById, updateTour, deleteTour } = require("./controllers/tour.controller");

// =======================
// ROUTES
// =======================

// User
app.post("/users/register", registerUser);
app.post("/users/login", loginUser);
app.get("/users/profile", authMiddleware, getUserProfile);

// Contact
app.post("/contactUs", createContact);
app.get("/contactUs", authMiddleware, adminMiddleware, getAllContactMessages);
app.get("/contactUs/:id", authMiddleware, adminMiddleware, getContactMessageById);
app.delete("/contactUs/:id", authMiddleware, adminMiddleware, deleteContactMessage);

// Blog (Added uploadBlogImage.single('image'))
app.post("/blog", authMiddleware, adminMiddleware, uploadBlogImage.single('image'), createPost);
app.get("/blog", getAllPosts);
app.get("/blog/:id", getPostById);
app.put("/blog/:id", authMiddleware, adminMiddleware, uploadBlogImage.single('image'), updatePost);
app.delete("/blog/:id", authMiddleware, adminMiddleware, deletePost);

// Gallery (Added uploadGalleryImage.single('image'))
app.get("/gallery", getGallery);
app.post("/gallery", authMiddleware, adminMiddleware, uploadGalleryImage.single('image'), addGalleryImage);
app.delete("/gallery/:id", authMiddleware, adminMiddleware, deleteGalleryImage);

// Analytics
app.post("/api/analytics/track", trackVisit);
app.get("/api/analytics", authMiddleware, adminMiddleware, getAnalytics);

// Tours (Added uploadTourImage.single('image'))
app.post("/tours", authMiddleware, adminMiddleware, uploadTourImage.single('image'), addTour);
app.get("/tours", getAllTours);
app.get("/tours/:id", getTourById);
app.put("/tours/:id", authMiddleware, adminMiddleware, uploadTourImage.single('image'), updateTour);
app.delete("/tours/:id", authMiddleware, adminMiddleware, deleteTour);

// =======================
// FRONTEND (SPA)
// =======================
const frontendPath = path.join(__dirname, "../tce_frontend/dist");

app.use(express.static(frontendPath, { index: false }));
app.get(/^(?!\/(users|contactUs|blog|api|gallery|tours)).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// =======================
// ERROR HANDLING
// =======================
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ message: "API endpoint not found" });
  }
  next();
});

app.use((err, req, res, next) => {
  // Handle Multer file size errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: "File too large. Max size is 5MB." });
  }
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// =======================
// START SERVER
// =======================
const startServer = async () => {
  try {
    // 1. Test Database Connection
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // 2. Sync Models
    await sequelize.sync({ force: false }); 
    console.log("✅ All models were synchronized successfully.");

    // =============================================
    // 3. FETCH & PRINT EXACT DATABASE DATA
    // =============================================
    const adminUser = await User.findOne({ 
      where: { isAdmin: true }, 
      attributes: ['id', 'username', 'email', 'password', 'isAdmin'] 
    });
    
    if (adminUser) {
      console.log("\n🔐 -------------------------------------");
      console.log("   EXACT DATA SAVED IN DATABASE:");
      console.log("   ID       :", adminUser.id);
      console.log("   Username :", adminUser.username);
      console.log("   Email    :", adminUser.email);
      console.log("   isAdmin  :", adminUser.isAdmin);
      console.log("   Password :", adminUser.password); // Prints the bcrypt hash
      console.log("🔐 -------------------------------------");
      console.log("   ⚠️  NOTE: The 'Password' above is HASHED.");
      console.log("   To log in, you must use the ORIGINAL text: 123456789");
      console.log("🔐 -------------------------------------\n");
    } else {
      console.log("\n⚠️  WARNING: No admin account found in database.");
      console.log("   Run 'node seed.js' to create one.\n");
    }

    // 4. Start Express Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://127.0.0.1:${PORT}\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// =======================
// SHUTDOWN
// =======================
const shutdown = async () => {
  console.log("\n👋 Shutting down...");
  try {
    await sequelize.close();
    console.log("📤 Database connection closed.");
  } catch (err) {
    console.error("Error closing database connection:", err);
  }
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
