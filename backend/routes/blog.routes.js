const express = require("express")
const router = express.Router()
const {createPost, getAllPosts, getPostById, updatePost, deletePost} = require("./../controllers/blog.controls")
const createUploader = require("./../middleware/image.uploader")

// Creating a specific uploader for blog images
const blogImageUpload = createUploader({
    destination: 'public/img/blog_uploads',
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp']
});

router.post("/", (req,res,next)=>{console.log("Blog route working"),next()},blogImageUpload.single("image"),createPost)
router.get("/",getAllPosts)
router.get("/:id", getPostById);
router.put("/:id", blogImageUpload.single("image"), updatePost);
router.delete("/:id", deletePost);



module.exports = router