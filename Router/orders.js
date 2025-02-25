const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth.js");
const Orders = require("../models/order.js")

router.post("/place-order", authenticateToken, async (req, res) => {
    try {
        console.log("Headers:", req.headers);
        console.log("Request Body:", req.body);

        const userId = req.headers.id; // Extract from middleware
        const { order } = req.body;

        if (!userId || !order || order.length === 0) {
            return res.status(400).json({ message: "User ID and order items are required." });
        }

        let savedOrders = [];

        for (const item of order) {
            console.log("Processing Order:", item);

            const newOrder = new Orders({
                user: userId,
                book: item._id,
            });

            const savedOrder = await newOrder.save();
            savedOrders.push(savedOrder);

            // Update user: Add order to orders array and remove from cart
            await User.findByIdAndUpdate(userId, {
                $push: { orders: savedOrder._id },
                $pull: { cart: item._id },
            });
        }

        return res.status(200).json({
            message: "Order placed successfully",
            orders: savedOrders,
        });
    } catch (error) {
        console.error("Order Placement Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});


router.get("/get-all-orders", authenticateToken, async (req, res) => {
    try {
        const userData = await Orders.find()
            .populate({ path: "book" })
            .populate({ path: "user" })
            .sort({ createdAt: -1 });

        return res.json({
            status: "Success",
            data: userData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});


router.get("/get-order-history", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" },
        });

        const ordersData = userData.orders.reverse();
        return res.json({
            status: "Success",
            data: ordersData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

router.put("/update-order-status/:orderId", authenticateToken, async (req, res) => {
    const { status } = req.body;

    // Ensure the provided status is valid
    const validStatuses = ["Order Placed", "Out For Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status provided." });
    }

    try {
        const order = await Orders.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        order.status = status;
        await order.save();

        return res.json({
            status: "Success",
            message: "Order status updated successfully.",
            data: order,
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({ message: "An error occurred while updating the order status." });
    }
});

module.exports = router;