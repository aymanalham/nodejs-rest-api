
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");

const getUsers =async (req,res)=>{
    const users = await User.find();
    // res.send(users)
    res.send("yes get getUsers")
}
const getUser = async (req, res ,next) => {
    
    let user;
    try {
        const id = req.params.id;
        user = await User.findById(id);

        if (!user) {
            return res.status(404).send("not found user");
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
const updateUser =async (req,res)=>{
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(id, req.body,{new:true , runValidators:true});
    res.status(201).send(user);
}
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
const register = async(req,res,next)=>{
    try {
        const name = req.body.name;
        const age = req.body.age;
        const email = req.body.email;
        const password = req.body.password;
       const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name:name,
            age:age,
            email:email,
            password:hashPassword
            
        })

        res.status(201).send({
            _id:user._id,
            name:user.name,
            age:user.age,
            email:user.email,
        });
    } catch (error) {
        next(error);    
    }
}
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
const getMe = async (req, res, next) => {
    try {
        if (typeof req.body.title ==="string"  &&  req.body.trim().length<= 3 &&  req.body.trim().length >100 ) {
            
        }
       
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send(user);

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


