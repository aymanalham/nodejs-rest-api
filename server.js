const express = require("express");
const connectDB = require("./config/db");
const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");
const app = express();

app.use(express.json());

const errorHandler = (err, req, res, next) => {
    if (err.name === "ValidationError") {
      
      const messages =  Object.values(err.errors).map(error=>error.message)
        return res.status(400).send(messages);
      }
      if (err.name === "CastError") {
      return res.status(400).send("Invalid ID");
      
    }

    res.status(500).send("Something went wrong");
};
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use(errorHandler);
app.listen(3000, () => {
    console.log("Server is running");
});

connectDB();
