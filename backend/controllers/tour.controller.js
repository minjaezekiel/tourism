// controllers/tour.controller.js
const { Tour } = require('../models/models');
const fs = require('fs');
const path = require('path');

// =======================
// ➕ CREATE TOUR
// =======================
const addTour = async (req, res) => {
  try {
    const { title, description, price, link } = req.body;

    if (!title || !description || !price || !link) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number"
      });
    }

    try {
      new URL(link);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid link URL"
      });
    }

    let imagePath = null;
    if (req.file) {
      imagePath = `/img/tours/${req.file.filename}`;
    }

    const tour = await Tour.create({
      title: title.trim(),
      description: description.trim(),
      price: parsedPrice,
      link: link.trim(),
      image: imagePath
    });

    return res.status(201).json({
      success: true,
      message: "Tour created successfully",
      data: tour
    });

  } catch (error) {
    console.error("Error creating tour:", error);
    return res.status(500).json({
      success: false,
      message: "Server error creating tour"
    });
  }
};

// =======================
// 📄 GET ALL TOURS
// =======================
const getAllTours = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await Tour.findAndCountAll({
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        perPage: limit
      }
    });

  } catch (error) {
    console.error("Error fetching tours:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching tours"
    });
  }
};

// =======================
// 📄 GET TOUR BY ID
// =======================
const getTourById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID"
      });
    }

    const tour = await Tour.findByPk(id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: tour
    });

  } catch (error) {
    console.error("Error fetching tour:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching tour"
    });
  }
};

// =======================
// ✏️ UPDATE TOUR
// =======================
const updateTour = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID"
      });
    }

    const tour = await Tour.findByPk(id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found"
      });
    }

    const { title, description, price, link } = req.body;

    if (title) tour.title = title.trim();
    if (description) tour.description = description.trim();

    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid price"
        });
      }
      tour.price = parsedPrice;
    }

    if (link) {
      try {
        new URL(link);
        tour.link = link.trim();
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid link"
        });
      }
    }

    let oldImagePath = null;

    if (req.file) {
      if (tour.image) {
        oldImagePath = path.join(__dirname, "../public", tour.image);
      }
      tour.image = `/img/tours/${req.file.filename}`;
    }

    await tour.save();

    // delete old image safely
    if (oldImagePath && fs.existsSync(oldImagePath)) {
      fs.unlink(oldImagePath, err => {
        if (err) console.error("Image delete error:", err);
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tour updated successfully",
      data: tour
    });

  } catch (error) {
    console.error("Error updating tour:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating tour"
    });
  }
};

// =======================
// 🗑️ DELETE TOUR
// =======================
const deleteTour = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID"
      });
    }

    const tour = await Tour.findByPk(id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found"
      });
    }

    if (tour.image) {
      const filePath = path.join(__dirname, "../public", tour.image);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, err => {
          if (err) console.error("Image delete error:", err);
        });
      }
    }

    await tour.destroy();

    return res.status(200).json({
      success: true,
      message: "Tour deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting tour:", error);
    return res.status(500).json({
      success: false,
      message: "Server error deleting tour"
    });
  }
};

// =======================
// 📊 GET TOUR STATS
// =======================
const getTourStats = async (req, res) => {
  try {
    const tours = await Tour.findAll();

    if (!tours.length) {
      return res.json({
        success: true,
        data: {
          totalTours: 0,
          latestTour: null,
          cheapestTour: null,
          mostExpensiveTour: null
        }
      });
    }

    const sortedByDate = [...tours].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    const sortedByPrice = [...tours].sort(
      (a, b) => a.price - b.price
    );

    return res.json({
      success: true,
      data: {
        totalTours: tours.length,
        latestTour: sortedByDate[0],
        cheapestTour: sortedByPrice[0],
        mostExpensiveTour: sortedByPrice[sortedByPrice.length - 1]
      }
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching stats"
    });
  }
};

// =======================
module.exports = {
  addTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
  getTourStats
};