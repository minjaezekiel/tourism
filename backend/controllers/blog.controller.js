const { Blog, User } = require('../models/models');
const fs = require("fs");
const path = require("path");

// =======================
// ➕ CREATE POST
// =======================
const createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required fields" });
    }

    let authorId = author ? parseInt(author) : null;

    if (!authorId || isNaN(authorId)) {
      const adminUser = await User.findOne({ where: { isAdmin: true } });
      
      if (adminUser) {
        authorId = adminUser.id;
      } else {
        const firstUser = await User.findOne();
        if (firstUser) {
          authorId = firstUser.id;
        } else {
          return res.status(400).json({ message: "Cannot create post: No users exist in the database." });
        }
      }
    } else {
      const authorExists = await User.findByPk(authorId);
      if (!authorExists) {
        return res.status(400).json({ message: `Author not found (ID: ${authorId})` });
      }
    }

    let imagePath = null;
    if (req.file) {
      imagePath = `/img/blog_uploads/${req.file.filename}`;
    }

    const newPost = await Blog.create({
      title: title.trim(),
      content: content.trim(),
      author_id: authorId, 
      image: imagePath
    });

    const savedPost = await Blog.findByPk(newPost.id, {
      include: [{ model: User, as: 'author' }]
    });

    res.status(201).json({
      message: 'Blog post created successfully!',
      data: {
        id: savedPost.id,
        title: savedPost.title,
        content: savedPost.content,
        author: savedPost.author ? {
          id: savedPost.author.id,
          username: savedPost.author.username,
          first_name: savedPost.author.first_name,
          last_name: savedPost.author.last_name
        } : null,
        image: savedPost.image,
        // FIX: Use createdAt (Sequelize's default JS format)
        created_at: savedPost.createdAt 
      }
    });

  } catch (error) {
    console.error(`Error creating Blog Post\n${error.message}`);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Server error while creating the post.' });
  }
};

// =======================
// 📄 GET ALL POSTS
// =======================
const getAllPosts = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      order: [['created_at', 'DESC']],
      include: [{ model: User, as: 'author' }]
    });
    
    const formattedBlogs = blogs.map(blog => ({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      author: blog.author ? {
        id: blog.author.id,
        username: blog.author.username,
        first_name: blog.author.first_name,
        last_name: blog.author.last_name
      } : null,
      image: blog.image,
      // FIX: Use createdAt (Sequelize's default JS format)
      created_at: blog.createdAt 
    }));
    
    res.status(200).json({ count: blogs.length, data: formattedBlogs });
    
  } catch (error) {
    console.error(`Error fetching Blog Posts\n${error.message}`);
    res.status(500).json({ message: "Server error fetching all posts..." });
  }
};

// =======================
// 📄 GET POST BY ID
// =======================
const getPostById = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ message: 'Invalid post ID format' });
    
    const post = await Blog.findByPk(postId, {
      include: [{ model: User, as: 'author' }]
    });
    
    if (!post) return res.status(404).json({ message: 'Blog post not found.' });
    
    res.status(200).json({ data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// =======================
// ✏️ UPDATE POST
// =======================
const updatePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { title, content } = req.body;
    if (isNaN(postId)) return res.status(400).json({ message: 'Invalid post ID format' });
    
    let post = await Blog.findByPk(postId);
    if (!post) return res.status(404).json({ message: "Blog post not found" });
    
    let oldImagePath = null;
    
    if (title) post.title = title.trim();
    if (content) post.content = content.trim();
    
    if (req.file) {
      if (post.image) oldImagePath = path.join(__dirname, "../public", post.image);
      post.image = `/img/blog_uploads/${req.file.filename}`;
    }
    
    await post.save();
    
    if (oldImagePath && fs.existsSync(oldImagePath)) {
      fs.unlink(oldImagePath, (err) => { if (err) console.error("Error deleting old image:", err); });
    }
    
    const updatedPost = await Blog.findByPk(postId, {
      include: [{ model: User, as: 'author' }]
    });
    
    res.status(200).json({
      message: "Blog updated successfully",
      data: updatedPost
    });
    
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: "Error updating post", error: error.message });
  }
};

// =======================
// 🗑️ DELETE POST
// =======================
const deletePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ message: 'Invalid post ID format' });
    
    const post = await Blog.findByPk(postId);
    if (!post) return res.status(404).json({ message: "Blog post not found" });
    
    if (post.image) {
      const fullImagePath = path.join(__dirname, "../public", post.image);
      if (fs.existsSync(fullImagePath)) {
        fs.unlink(fullImagePath, (err) => { if (err) console.error("Error deleting image:", err); });
      }
    }
    
    await post.destroy();
    res.status(200).json({ message: "Blog post deleted successfully" });
    
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
};

// =======================
// 📊 GET POSTS PAGINATED
// =======================
const getPostsPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const offset = (page - 1) * perPage;

    const { count, rows } = await Blog.findAndCountAll({
      order: [['created_at', 'DESC']],
      include: [{ model: User, as: 'author' }],
      limit: perPage,
      offset: offset
    });
    
    const formattedPosts = rows.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author ? {
        id: post.author.id,
        username: post.author.username,
        first_name: post.author.first_name,
        last_name: post.author.last_name
      } : null,
      image: post.image,
      created_at: post.createdAt
    }));
    
    res.status(200).json({
      data: formattedPosts,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / perPage),
        currentPage: page,
        perPage: perPage
      }
    });
    
  } catch (error) {
    console.error('Get paginated posts error:', error);
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsPaginated
};