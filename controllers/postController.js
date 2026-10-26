const Post = require("../models/Post");

// GET /posts
// Get all posts with pagination, search, and sorting
const getPosts = async (req, res, next) => {
try {
const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 10;
const search = req.query.search;
const sortBy = req.query.sortBy || "_id";
const orderQuery = req.query.order || "asc";

    if (!Number.isInteger(page) || page < 1) {
        return res.status(400).json({
            message: "Page must be a positive integer"
        });
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        return res.status(400).json({
            message: "Limit must be between 1 and 100"
        });
    }

    const allowedSortFields = ["title", "_id", "createdAt"];

    if (!allowedSortFields.includes(sortBy)) {
        return res.status(400).json({
            message: "Invalid sort field"
        });
    }

    if (!["asc", "desc"].includes(orderQuery)) {
        return res.status(400).json({
            message: "Order must be asc or desc"
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
        .populate("user", "name")
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        posts,
        pagination: {
            currentPage: page,
            limit,
            totalPosts,
            totalPages,
            results: posts.length,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1 && totalPages > 0
        }
    });
} catch (error) {
    next(error);
}

};

// GET /posts/:id
// Get one post
const getPost = async (req, res, next) => {
try {
const post = await Post.findById(req.params.id)
.populate("user", "name");

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    res.status(200).json(post);
} catch (error) {
    next(error);
}

};

// POST /posts
// Create a post for the logged-in user
const createPost = async (req, res, next) => {
try {
const { title } = req.body;

    if (typeof title !== "string" ||
        title.trim().length < 5 ||
        title.trim().length > 100) {
        return res.status(400).json({
            message: "Title must be between 5 and 100 characters"
        });
    }

    const post = await Post.create({
        title: title.trim(),
        user: req.userId
    });

    res.status(201).json(post);
} catch (error) {
    next(error);
}

};

// PATCH /posts/:id
// Update a post
const updatePost = async (req, res, next) => {
try {
const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    const isOwner =
        post.user.toString() === req.userId.toString();

    const isAdmin = req.role === "admin";

    if (!isOwner && !isAdmin) {
        return res.status(403).json({
            message: "You are not allowed to update this post"
        });
    }

    const { title } = req.body;

    if (typeof title !== "string" ||
        title.trim().length < 5 ||
        title.trim().length > 100) {
        return res.status(400).json({
            message: "Title must be between 5 and 100 characters"
        });
    }

    post.title = title.trim();

    await post.save();

    res.status(200).json(post);
} catch (error) {
    next(error);
}

};

// DELETE /posts/:id
// Delete a post
const deletePost = async (req, res, next) => {
try {
const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    const isOwner =
        post.user.toString() === req.userId.toString();

    const isAdmin = req.role === "admin";

    if (!isOwner && !isAdmin) {
        return res.status(403).json({
            message: "You are not allowed to delete this post"
        });
    }

    await post.deleteOne();

    res.status(200).json({
        message: "Post deleted successfully"
    });
} catch (error) {
    next(error);
}

};

// PUT /posts/:id
// Replace the post title without changing its owner
const updatePostPut = async (req, res, next) => {
try {
const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    const isOwner =
        post.user.toString() === req.userId.toString();

    const isAdmin = req.role === "admin";

    if (!isOwner && !isAdmin) {
        return res.status(403).json({
            message: "You are not allowed to update this post"
        });
    }

    const { title } = req.body;

    if (typeof title !== "string" ||
        title.trim().length < 5 ||
        title.trim().length > 100) {
        return res.status(400).json({
            message: "Title must be between 5 and 100 characters"
        });
    }

    post.title = title.trim();

    await post.save();

    res.status(200).json(post);
} catch (error) {
    next(error);
}

};

module.exports = {
getPosts,
getPost,
createPost,
updatePost,
deletePost,
updatePostPut
};