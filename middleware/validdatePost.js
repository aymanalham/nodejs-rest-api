const validatePost = (req, res, next) => {
    const { title } = req.body;

    if (typeof title !== "string") {
        return res.status(400).json({
            message: "Title must be a string"
        });
    }

    if (title.trim().length < 3 || title.trim().length > 100) {
        return res.status(400).json({
            message: "Title must be between 3 and 100 characters"
        });
    }

    next();
   
};
module.exports = validatePost;
