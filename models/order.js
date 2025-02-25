const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true, // Ensure user is required
        },
        book: {
            type: mongoose.Types.ObjectId,
            ref: "Book",
            required: true, // Ensure book is required
        },
        status: {
            type: String,
            default: "Order Placed",
            enum: ["Order Placed", "Out For Delivery", "Delivered", "Cancelled"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Orders", orderSchema);
