const Post = require("../models/Post");
const User = require("../models/User");
const getPosts = async (req, res, next) => {

    try {

        // const indexes = await Post.collection.indexes();
        console.log("yes getPost")
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search;
        if (!Number.isInteger(page) || page < 1) {
            return res.status(400).json({
                message: "Invalid page"
            });
        }
        if (
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                message: "Invalid limit"
            });
        }

        const sortBy = req.query.sortBy || "_id";
        const orderQuery = req.query.order || "asc";
        const allowedSortFields = ["title", "_id"];
        if (!allowedSortFields.includes(sortBy)) {
            return res.status(400).json({
                message: "Invalid sort field"
            });
        }
        if (!["asc", "desc"].includes(orderQuery)) {
            return res.status(400).json({
                message: "Invalid sort order"
            });
        }

        const order = orderQuery === "desc" ? -1 : 1;
        const skip = (page - 1) * limit;
        const filter = {};

        if (search) {
            const escapedSearch = search.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.title = {
                $regex: escapedSearch,
                $options: "i"
            };
        }
        const totalPosts = await Post.countDocuments(filter);
        const totalPages = Math.ceil(totalPosts / limit);
        if (totalPages > 0 && page > totalPages) {
            return res.status(404).json({
                message: "Page not found",
                totalPages
            });
        }
        const posts = await Post.find(filter)
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit);
        const results = posts.length;
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1 && totalPages > 0;
        res.json({
            posts
        });

    } catch (error) {
        next(error);
    }
};

const getPost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id).populate("user" , "name");
        res.send(post);
    } catch (error) {
        // console.log(error);
        next(error);
    }
};
const createPost = async(req,res,next)=>{
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).send("user not found")
        }
        const newPost = await Post.create({
            title: req.body.title,
            user: req.body.userId
        })

        res.status(201).send(newPost)
    } catch (error) {
        next(error)
    }
}
const updatePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log("Requested post ID:", id);
        const post = await Post.findById(id);
        if (!req.body.title) {
            return res.status(400).send("Title is required");
        }
        if (!post) {
            return res.status(404).send("Post not found");
        }
        if (req.userId.toString() !== post.user.toString()) {
            return res.status(403).send("You are not allowed to update this post");
        }

        post.title = req.body.title;
        await post.save();
        res.send(post);

    } catch (error) {
        next(error);
    }
};
const deletePost = async (req, res, next) => {
    try {
        const id = req.params.id;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).send("Post not found");
        }

        if (req.userId.toString() !== post.user.toString()) {
            return res.status(403).send("You are not allowed to delete this post");
        }

        await Post.findByIdAndDelete(id);

        res.send("Post deleted successfully");

    } catch (error) {
        next(error);
    }
};
const updatePostPut = async(req,res,next)=>{
    const id = req.params.id;
    try {
        const post = await Post.findById(id);
        if (!req.body.title) {
            return res.status(400).send("title is required")
        }
        if (!req.body.userId) {
            return res.status(400).send("User ID is required")
        }
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).send("user not found")
        }
        const updatedPost = await Post.findByIdAndUpdate(id, {
            title: req.body.title,
            user: req.body.userId   
        }, {
            new: true,
            runValidators: true
        });
        if (!updatedPost) {
            return res.status(404).send("Post not found");
        }
        res.send(updatedPost)
    } catch (error) {
        next(error)
    }
}
module.exports = {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    updatePostPut,
    getPost
};

