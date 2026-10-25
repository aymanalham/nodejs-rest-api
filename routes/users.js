const express = require("express");
const router = express.Router();
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    replaceUser,
    deletUser,
    register,
    login,
    getMe
} = require("../controllers/userController");

const {authMiddleware} = require("../middleware/authMiddleware");
const validateUser = (req, res, next) => {
    if (!req.body.name || req.body.age == undefined) {
        return res.status(404).send("name and age are required");
    }

    next();
};
console.log("POST ROUTE REGISTERED");

router.get("/test", (req, res, next) => {
    try {
        throw new Error("My first error in try");
    } catch (err) {
        next(err);
    }
});
router.get("/", getUsers);
router.get("/me",authMiddleware, getMe);
router.post("/register", register);
router.post("/login", login);
router.get("/:id", getUser);
router.post("/", validateUser, createUser);
router.patch("/:id", authMiddleware, updateUser);
router.put("/:id", replaceUser);
router.delete("/:id", deletUser);
module.exports = router;
