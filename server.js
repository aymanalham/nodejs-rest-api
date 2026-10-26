const express = require("express");
const connectDB = require("./config/db");

const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");

const app = express();

app.use(express.json());

// Routes
app.use("/users", userRouter);
app.use("/posts", postRouter);

// Handle unknown routes
app.use((req, res) => {
res.status(404).json({
message: "Route not found"
});
});

// Global error handler
const errorHandler = (err, req, res, next) => {
// Invalid JSON
if (
err instanceof SyntaxError &&
err.status === 400 &&
"body" in err
) {
return res.status(400).json({
message: "Invalid JSON body"
});
}

// Mongoose validation errors
if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(
        (error) => error.message
    );

    return res.status(400).json({
        message: "Validation failed",
        errors: messages
    });
}

// Invalid MongoDB ObjectId
if (err.name === "CastError") {
    return res.status(400).json({
        message: "Invalid ID format"
    });
}

// Duplicate values, such as an existing email
if (err.code === 11000) {
    return res.status(409).json({
        message: "A record with this value already exists"
    });
}

console.error(err);

return res.status(500).json({
    message: "Internal server error"
});

};

// Error handler must be registered after routes
app.use(errorHandler);

const startServer = async () => {
try {
await connectDB();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
}

};

startServer();