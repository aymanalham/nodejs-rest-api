const express = require("express");
const router = express.Router();

const { getPosts , createPost , updatePost , deletePost , updatePostPut ,getPost} = require("../controllers/postController");
const {authMiddleware} = require("../middleware/authMiddleware");
const validatePost = require("../middleware/validdatePost");


router.get("/", getPosts);
router.get("/:id", getPost );
router.post("/", createPost);
router.patch("/:id", authMiddleware  , validatePost ,updatePost);
router.delete("/:id", deletePost);
router.put("/:id", updatePostPut);


module.exports = router;