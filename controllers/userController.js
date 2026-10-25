
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


const getUsers = async (req, res) => {
    const users = await User.find().select("-password");
    res.send(users);
};
const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send(user);

    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send(user);

    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res) => {

  console.log("Mongo state:", mongoose.connection.readyState);
  const newUser = await User.create({
        name: req.body.name,
        age: req.body.age
    });

    res.status(201).send(newUser);
};
const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
       
       if (req.userId.toString() !== id && req.role !== "admin") {
    return res.status(403).send("You can only update your own account");
}
        const { name, age } = req.body;

        const updates = {};

        if (name !== undefined) {
            updates.name = name;
        }

        if (age !== undefined) {
            updates.age = age;
        }

        const user = await User.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.status(200).send(user);

    } catch (error) {
        next(error);
    }
};
 const replaceUser = async(req,res ,next)=>{
    let user;
     try {
        const id = req.params.id;
        user = await User.findByIdAndUpdate(id, req.body, { new: true });

        if (!user) {
            return res.status(404).send("not found user");
        }

        res.send(user);

    } catch (error) {
       next(error); 
    }
 }
const deletUser = async(req,res)=>{
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return res.status(404).send("not found user")
    }       
    res.status(201).send(user);
}
const register = async (req, res, next) => {
    try {
        
        const { name, age, email, password } = req.body;

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            age,
            email,
            password: hashPassword,
            role: "user"
        });

        res.status(201).send({
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
const login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email: email }).select("+password");
        if (!user) {
            return res.status(401).send("invalid email or password for user");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("invalid email or password for passsword");
               
        }
           
            const token = jwt.sign({ userId: user._id , role:user.role }, process.env.JWT_SECRET, { expiresIn: "10h" });
            return res.status(200).send({ token });

    } catch (error) {
        next(error);
    }
};
module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    replaceUser,
    deletUser,
    register,
    login,
    getMe

}


