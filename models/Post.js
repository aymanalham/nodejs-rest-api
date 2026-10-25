
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
           title: {
            type: String,
            required: true,
            minlength: 5
        },

        user: {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    },
    {
        timestamps: true
    }
);

postSchema.index({ title: 1 });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
