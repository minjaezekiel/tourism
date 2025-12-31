const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  addTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
  getTourStats
} = require("./../controllers/tours.controller");

const router = express.Router();

// Ensure upload directory exists
const toursDir = path.join(__dirname, "../public/img/tours");
if (!fs.existsSync(toursDir)) {
  fs.mkdirSync(toursDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, toursDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files (jpeg, jpg, png, webp, gif) are allowed"));
  }
});

// Routes
router.get("/", getAllTours); // GET /tours
router.get("/stats", getTourStats); // GET /tours/stats (optional)
router.get("/:id", getTourById); // GET /tours/:id
router.post("/", upload.single("image"), addTour); // POST /tours
router.put("/:id", upload.single("image"), updateTour); // PUT /tours/:id
router.delete("/:id", deleteTour); // DELETE /tours/:id

module.exports = router;