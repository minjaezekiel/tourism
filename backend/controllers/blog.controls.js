const blog = require("./../models/blog")


//create post controller
const createPost = async (req,res)=>{
    try{
        //check if file has been received
        if(!req.file){
            return res.status(400).json({message:"Image file is required..."})
        }
        //receiving files from the request.body
        const {title, content, author} = req.body

        //accessing the image via image path
        const imagePath = `/img/blog_uploads/${req.file.filename}`;

        //saving data to db..
        const newPost = await blog.create({
            title,
            content,
            author, // This will be the User's ObjectId
            image: imagePath
        })

        //populate the the author field before sending response 
        const savedPost = await blog.findById(newPost._id).populate('author', 'username');

        res.status(201).json({
            message: 'Blog post created successfully!',
            data: savedPost})

    }catch(error){
        console.error(`Error creating Blog Post\n${error.message}`)

        //Send a generic error response back to the client
        res.status(500).json({ message: 'Server error while creating the post.' });
    }
}

//get all posts
const getAllPosts = async (req,res)=>{
    try{
        const blogs = await blog.find({})
            .populate('author', 'username')
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json({
            count: blogs.length,
            data: blogs
        })

    }catch(error){
        console.error(`Error creating Blog Post\n${error.message}`)

        //sending generic error response back to client 
        res.status(500).json({message:"Server error fetching all posts..."})
    }
}

//get post by id
const getPostById = async (req, res) => {
    try {
        const post = await blog.findById(req.params.id).populate('author', 'username');

        if (!post) {
            return res.status(404).json({ message: 'Blog post not found.' });
        }

        res.status(200).json({
            data: post
        });
    } catch (error) {
        console.error(error);
        //sending error message to client
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

//update post
const updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        let post = await blog.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        // Update fields only if provided
        if (title) post.title = title;
        if (content) post.content = content;

        if (req.file) {
            post.image = `/img/blog_uploads/${req.file.filename}`;
        }

        // Save safely with validation + hooks
        await post.save();

        post = await blog.findById(req.params.id).populate("author", "username");

        console.log(`Blog post updated successfully...\n${post}`)

        res.status(200).json({
            message: "Blog updated successfully",
            data: post
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating post", error: error.message });
    }
};

//delete post
const deletePost = async (req, res) => {
    try {
        //console.log(req.params.id);
        const post = await blog.findById(req.params.id);
        console.log(post);
        if (!post) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        await post.deleteOne();  // runs validations & hooks if defined

        res.status(200).json({ message: "Blog post deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting post", error: error.message });
    }
};










module.exports = {createPost, getAllPosts, getPostById, updatePost,deletePost}