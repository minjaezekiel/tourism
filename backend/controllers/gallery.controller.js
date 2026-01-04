const Gallery = require('../models/gallery');

// Get all gallery images
exports.getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch gallery' });
  }
};

// Add new image from uploaded file
exports.addGalleryImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image file required' });

    const { alt } = req.body;
    const src = `/img/gallery/${req.file.filename}`; // store relative path

    const image = await Gallery.create({ alt, src });
    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add image', error: err.message });
  }
};

// Delete image
exports.deleteGalleryImage = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete image' });
  }
};
