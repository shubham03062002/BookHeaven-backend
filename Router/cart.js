const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth.js");

// ✅ Add to Cart Route
router.put("/add-to-cart", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);

        if (userData) {
            const isBookInCart = userData.cart.includes(bookid);
            if (isBookInCart) {
                return res.status(200).json({ message: "Book is already in cart" });
            }
            await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
            return res.status(200).json({ message: "Book added to cart" });
        }

        return res.status(404).json({ message: "User not found" });

    } catch (error) {
        console.error("Error in add-to-cart:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Remove from Cart Route
router.put("/remove-from-cart", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);

        if (userData) {
            const isBookInCart = userData.cart.includes(bookid);
            if (isBookInCart) {
                await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
                return res.status(200).json({ message: "Book removed from cart" });
            } else {
                return res.status(400).json({ message: "Book not found in cart" });
            }
        }

        return res.status(404).json({ message: "User not found" });

    } catch (error) {
        console.error("Error in remove-from-cart:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Get All Books in Cart
router.get("/mycart", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate("cart"); // Populate cart details

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ cart: userData.cart });

    } catch (error) {
        console.error("Error in mycart:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
