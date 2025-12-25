const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    img_src: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);
