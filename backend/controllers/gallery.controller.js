// controllers/gallery.controller.js
const { Gallery } = require('../models/models');
const fs = require('fs');
const path = require('path');

/**
 * 📄 GET ALL GALLERY IMAGES
 */
const getGallery = async (req, res) => {
  try {
    // Sequelize uses findAll with an options object for ordering
    const images = await Gallery.findAll({
      order: [['created_at', 'DESC']]
    });

    // Access properties directly (img.id) instead of img.get('id')
    const data = images.map(img => ({
      id: img.id,
      alt: img.alt,
      src: img.src,
      created_at: img.created_at
    }));

    res.status(200).json({ 
      success: true, 
      count: images.length, 
      data 
    });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error fetching gallery" 
    });
  }
};

/**
 * ➕ ADD GALLERY IMAGE
 */
const addGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Image file is required" 
      });
    }

    const { alt } = req.body;
    const imagePath = `/img/gallery/${req.file.filename}`;

    const newImage = await Gallery.create({
      alt: alt ? alt.trim() : "Gallery Image",
      src: imagePath
    });

    res.status(201).json({ 
      success: true, 
      message: "Image added successfully", 
      data: {
        id: newImage.id,
        alt: newImage.alt,
        src: newImage.src,
        created_at: newImage.created_at
      }
    });
  } catch (error) {
    console.error("Error adding gallery image:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error adding image" 
    });
  }
};

/**
 * 🗑️ DELETE GALLERY IMAGE
 */
const deleteGalleryImage = async (req, res) => {
  try {
    const imageId = parseInt(req.params.id);

    if (isNaN(imageId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid image ID format" 
      });
    }

    // Sequelize uses findByPk for finding by Primary Key (ID)
    const image = await Gallery.findByPk(imageId);

    if (!image) {
      return res.status(404).json({ 
        success: false, 
        message: "Image not found" 
      });
    }

    // Delete file from filesystem
    // Access 'src' directly from the instance
    const imagePath = image.src;
    if (imagePath) {
      const fullPath = path.join(__dirname, "../public", imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
          if (err) console.error("Error deleting image file:", err);
        });
      }
    }

    // Sequelize uses .destroy() to delete a record
    await image.destroy();

    res.status(200).json({ 
      success: true, 
      message: "Image deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error deleting image" 
    });
  }
};

module.exports = {
  getGallery,
  addGalleryImage,
  deleteGalleryImage
};