const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    link: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String, // /img/tour_uploads/filename.jpg
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tour", tourSchema);
