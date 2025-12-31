const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // Make it optional to avoid validation errors
    }
  },
  {
    timestamps: true
  }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
