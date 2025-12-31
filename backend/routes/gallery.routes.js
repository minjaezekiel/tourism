const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallery.controller');
const createUploader = require('../middleware/image.uploader'); // similar to blog uploader

const galleryImageUpload = createUploader({
  destination: 'public/img/gallery',
  fileSizeLimit: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp']
});

router.get('/', galleryController.getGallery);
router.post('/', galleryImageUpload.single('image'), galleryController.addGalleryImage);
router.delete('/:id', galleryController.deleteGalleryImage);

module.exports = router;
