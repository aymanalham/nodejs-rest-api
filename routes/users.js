const express = require("express");
const router = express.Router();

const {
getUsers,
getUser,
getMe,
updateUser,
register,
login
} = require("../controllers/userController");

const {
authMiddleware,
adminMiddleware
} = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Logged-in users
router.get("/me", authMiddleware, getMe);
router.patch("/:id", authMiddleware, updateUser);

// Admin-only routes
router.get("/", authMiddleware, adminMiddleware, getUsers);
router.get("/:id", authMiddleware, adminMiddleware, getUser);

module.exports = router;