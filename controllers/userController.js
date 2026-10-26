const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// GET /users
// Only admins can list users; password is never returned
const getUsers = async (req, res, next) => {
try {
const users = await User.find()
.select("name age email role");

    res.status(200).json(users);
} catch (error) {
    next(error);
}

};

// GET /users/:id
// Only admins can view user details
const getUser = async (req, res, next) => {
try {
const user = await User.findById(req.params.id)
.select("name age email role");

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.status(200).json(user);
} catch (error) {
    next(error);
}

};

// GET /users/me
// Get the logged-in user's profile
const getMe = async (req, res, next) => {
try {
const user = await User.findById(req.userId)
.select("name age email role");

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.status(200).json(user);
} catch (error) {
    next(error);
}

};

// PATCH /users/:id
// Update the user's own profile; admins can update other users
const updateUser = async (req, res, next) => {
try {
const id = req.params.id;

    const isOwner = req.userId.toString() === id;
    const isAdmin = req.role === "admin";

    if (!isOwner && !isAdmin) {
        return res.status(403).json({
            message: "You can only update your own account"
        });
    }

    const { name, age } = req.body;
    const updates = {};

    if (name !== undefined) {
        if (typeof name !== "string" || name.trim().length < 3) {
            return res.status(400).json({
                message: "Name must contain at least 3 characters"
            });
        }

        updates.name = name.trim();
    }

    if (age !== undefined) {
        const parsedAge = Number(age);

        if (!Number.isInteger(parsedAge) || parsedAge < 18) {
            return res.status(400).json({
                message: "Age must be an integer of at least 18"
            });
        }

        updates.age = parsedAge;
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({
            message: "Provide name or age to update"
        });
    }

    const user = await User.findByIdAndUpdate(
        id,
        { $set: updates },
        {
            new: true,
            runValidators: true
        }
    ).select("name age email role");

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.status(200).json(user);
} catch (error) {
    next(error);
}

};

// POST /users/register
const register = async (req, res, next) => {
try {
const { name, age, email, password } = req.body;

    if (
        typeof name !== "string" ||
        name.trim().length < 3
    ) {
        return res.status(400).json({
            message: "Name must contain at least 3 characters"
        });
    }

    const parsedAge = Number(age);

    if (!Number.isInteger(parsedAge) || parsedAge < 18) {
        return res.status(400).json({
            message: "Age must be an integer of at least 18"
        });
    }

    if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
        return res.status(400).json({
            message: "A valid email address is required"
        });
    }

    if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({
            message: "Password must contain at least 6 characters"
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
        email: normalizedEmail
    });

    if (existingUser) {
        return res.status(409).json({
            message: "Email is already registered"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name: name.trim(),
        age: parsedAge,
        email: normalizedEmail,
        password: hashedPassword,
        role: "user"
    });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        age: user.age,
        email: user.email,
        role: user.role
    });
} catch (error) {
    next(error);
}

};

// POST /users/login
const login = async (req, res, next) => {
try {
const { email, password } = req.body;

    if (
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const user = await User.findOne({
        email: email.trim().toLowerCase()
    }).select("+password");

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
        {
            userId: user._id.toString(),
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "10h"
        }
    );

    res.status(200).json({
        token
    });
} catch (error) {
    next(error);
}

};

module.exports = {
getUsers,
getUser,
getMe,
updateUser,
register,
login
};