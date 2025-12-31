const Tour = require("../models/Tour");
const fs = require("fs");
const path = require("path");

/**
 * ➕ CREATE TOUR
 */
const addTour = async (req, res) => {
  console.log("Add Tour hit");
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  try {
    const { title, description, price, link } = req.body;

    // Validate required fields
    if (!title || !description || !price || !link) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required: title, description, price, link" 
      });
    }

    // Validate price format (optional but recommended)
    if (!/^\$?\d+(\.\d{2})?$/.test(price.trim())) {
      return res.status(400).json({
        success: false,
        message: "Invalid price format. Use format like: $99.99 or 99.99"
      });
    }

    // Validate URL format for link (optional)
    try {
      new URL(link); // Will throw if invalid URL
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format for link"
      });
    }

    let imagePath = null;
    if (req.file) {
      // Ensure consistent path format
      imagePath = `/img/tours/${req.file.filename}`;
    }

    const newTour = await Tour.create({
      title: title.trim(),
      description: description.trim(),
      price: price.trim(),
      link: link.trim(),
      image: imagePath
    });

    res.status(201).json({ 
      success: true, 
      message: "Tour created successfully", 
      data: newTour 
    });

  } catch (error) {
    console.error("Error creating tour:", error);
    
    // Handle duplicate key errors (if you have unique constraints)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Tour with this title already exists"
      });
    }
    
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error while creating tour",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

/**
 * 📄 GET ALL TOURS (with optional pagination)
 */
const getAllTours = async (req, res) => {
  try {
    // Optional pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Optional search filter
    const search = req.query.search;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ]
      };
    }

    const [tours, total] = await Promise.all([
      Tour.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Tour.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({ 
      success: true, 
      count: tours.length,
      total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      data: tours 
    });
  } catch (error) {
    console.error("Error fetching tours:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error fetching tours" 
    });
  }
};

/**
 * 📄 GET TOUR BY ID
 */
const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    
    if (!tour) {
      return res.status(404).json({ 
        success: false, 
        message: "Tour not found" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: tour 
    });
  } catch (error) {
    console.error("Error fetching tour:", error);
    
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid tour ID format"
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error fetching tour" 
    });
  }
};

/**
 * ✏️ UPDATE TOUR
 */
const updateTour = async (req, res) => {
  try {
    const { title, description, price, link } = req.body;
    const tourId = req.params.id;

    // Check if any update data is provided
    if (!title && !description && !price && !link && !req.file) {
      return res.status(400).json({
        success: false,
        message: "No update data provided"
      });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ 
        success: false, 
        message: "Tour not found" 
      });
    }

    // Store old image path for cleanup
    let oldImagePath = null;

    // Update fields if provided
    if (title) tour.title = title.trim();
    if (description) tour.description = description.trim();
    if (price) {
      // Validate price format on update too
      if (!/^\$?\d+(\.\d{2})?$/.test(price.trim())) {
        return res.status(400).json({
          success: false,
          message: "Invalid price format"
        });
      }
      tour.price = price.trim();
    }
    if (link) {
      // Validate URL on update
      try {
        new URL(link);
        tour.link = link.trim();
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid URL format for link"
        });
      }
    }

    // Handle image update
    if (req.file) {
      // Store old image for deletion
      if (tour.image) {
        oldImagePath = path.join(__dirname, "../public", tour.image);
      }
      
      // Set new image
      tour.image = `/img/tours/${req.file.filename}`;
    }

    await tour.save();

    // Delete old image file if it exists and was replaced
    if (oldImagePath && fs.existsSync(oldImagePath)) {
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error("Error deleting old image:", err);
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Tour updated successfully", 
      data: tour 
    });

  } catch (error) {
    console.error("Error updating tour:", error);
    
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid tour ID format"
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error updating tour" 
    });
  }
};

/**
 * 🗑️ DELETE TOUR
 */
const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    
    if (!tour) {
      return res.status(404).json({ 
        success: false, 
        message: "Tour not found" 
      });
    }

    // Delete associated image file if it exists
    if (tour.image) {
      const imagePath = path.join(__dirname, "../public", tour.image);
      
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Error deleting tour image:", err);
        });
      }
    }

    await tour.deleteOne();
    
    res.status(200).json({ 
      success: true, 
      message: "Tour deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting tour:", error);
    
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid tour ID format"
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error deleting tour" 
    });
  }
};

/**
 * 📊 GET TOUR STATS (Optional extra endpoint)
 */
const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $group: {
          _id: null,
          totalTours: { $sum: 1 },
          latestTour: { $max: "$createdAt" },
          cheapestTour: { $min: { $toDouble: { $substr: ["$price", 1, -1] } } },
          mostExpensiveTour: { $max: { $toDouble: { $substr: ["$price", 1, -1] } } }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: stats[0] || {}
    });
  } catch (error) {
    console.error("Error fetching tour stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching tour statistics"
    });
  }
};

module.exports = { 
  addTour, 
  getAllTours, 
  getTourById, 
  updateTour, 
  deleteTour,
  getTourStats // Optional
};