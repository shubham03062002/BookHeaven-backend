const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    price: {
        type: Number, // Changed from String to Number
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    lang: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Fix module.exports
module.exports = mongoose.model("Book", bookSchema);
