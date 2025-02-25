const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: "https://png.pngtree.com/png-clipart/20200224/original/pngtree-cartoon-color-simple-male-avatar-png-image_5230557.jpg", // Replace with an actual image link
        },
        role: {
            type: String,
            default: "user",
            enum: ["user", "admin"],
        },
        favourites: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Book",
            },
        ],
        cart: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Book",
            },
        ],
        orders: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Orders",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
