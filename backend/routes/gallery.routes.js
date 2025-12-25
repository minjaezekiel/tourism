const express = require('express');
const router = express.Router();

const uploadImage = require('../middleware/image.uploader');
const {
  createGalleryItem,
  getAllGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem
} = require('../controllers/gallery.controls');

// Create
router.post('/', uploadImage, createGalleryItem);

// Read
router.get('/', getAllGalleryItems);
router.get('/:id', getGalleryItemById);

// Update
router.put('/:id', uploadImage, updateGalleryItem);

// Delete
router.delete('/:id', deleteGalleryItem);

module.exports = router;
