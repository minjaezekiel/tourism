const Gallery = require('../models/gallery');

/**
 * @desc    Create gallery item
 * @route   POST /api/gallery
 * @access  Public
 */
exports.createGalleryItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    const galleryItem = new Gallery({
      img_src: req.file.path, // ✅ Save image path
      content
    });

    const savedItem = await galleryItem.save();

    res.status(201).json({
      success: true,
      data: savedItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all gallery items
 * @route   GET /api/gallery
 * @access  Public
 */
exports.getAllGalleryItems = async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gallery.length,
      data: gallery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get single gallery item
 * @route   GET /api/gallery/:id
 * @access  Public
 */
exports.getGalleryItemById = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid ID'
    });
  }
};

/**
 * @desc    Update gallery item
 * @route   PUT /api/gallery/:id
 * @access  Public
 */
exports.updateGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    // Update text
    if (req.body.content) {
      item.content = req.body.content;
    }

    // Update image if new one uploaded
    if (req.file) {
      item.img_src = req.file.path;
    }

    const updatedItem = await item.save();

    res.status(200).json({
      success: true,
      data: updatedItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete gallery item
 * @route   DELETE /api/gallery/:id
 * @access  Public
 */
exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid ID'
    });
  }
};
