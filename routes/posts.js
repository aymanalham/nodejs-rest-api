const express = require("express");
const router = express.Router();

const {
getPosts,
getPost,
createPost,
updatePost,
deletePost,
updatePostPut
} = require("../controllers/postController");

const { authMiddleware } = require("../middleware/authMiddleware");
const validatePost = require("../middleware/validdatePost");
// Public routes
router.get("/", getPosts);
router.get("/:id", getPost);

// Protected routes
router.post("/", authMiddleware, createPost);
router.patch("/:id", authMiddleware, validatePost, updatePost);
router.put("/:id", authMiddleware, updatePostPut);
router.delete("/:id", authMiddleware, deletePost);
module.exports = router;