const validatePost = (req, res, next) => {
const { title } = req.body;

if (typeof title !== "string") {
    return res.status(400).json({
        message: "Title must be a string"
    });
}

const trimmedTitle = title.trim();

if (trimmedTitle.length < 5 || trimmedTitle.length > 100) {
    return res.status(400).json({
        message: "Title must be between 5 and 100 characters"
    });
}

next();

};

module.exports = validatePost;