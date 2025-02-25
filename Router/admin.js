const express = require("express");
const User = require("../models/user.js");
const { authenticateToken } = require("./userAuth.js");
const Book= require("../models/books.js");
const mongoose =require("mongoose")

const router = express.Router();

router.post("/add-book", authenticateToken, async (req, res) => {
    try {
        // Extract user ID from headers
        const id = req.headers.id;
        
        // Validate user ID
        if (!id) {
            return res.status(400).json({ message: "User ID is required in headers" });
        }

        // Fetch admin user from database
        const adminUser = await User.findById(id);
        if (!adminUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user is admin
        if (adminUser.role !== "admin") {
            return res.status(403).json({ message: "Access Denied! Only Admins can add books" });
        }

        // Extract book details from request body
        const { url, title, author, price, desc, lang } = req.body;

        // Validate required fields
        if (!url || !title || !author || !price || !desc || !lang) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create and save the book
        const addedBook = new Book({ url, title, author, price, desc, lang });
        await addedBook.save();

        // Return success response
        res.status(201).json({ message: "Book Added Successfully", addedBook });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/update-book/:id", authenticateToken, async (req, res) => {
    try {
        const adminId = req.headers.id;

        // Validate adminId
        if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
            return res.status(400).json({ message: "Invalid admin ID" });
        }

        // Check if admin exists
        const adminUser = await User.findById(adminId);
        if (!adminUser) {
            return res.status(404).json({ message: "Admin user not found" });
        }

        // Check if user is admin
        if (adminUser.role !== "admin") {
            return res.status(403).json({ message: "Access Denied. Only admins can update books." });
        }

        // Validate book ID
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid book ID" });
        }

        const { url, title, author, price, desc, lang } = req.body;

        // Update book
        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { url, title, author, price, desc, lang },
            { new: true } // Returns the updated document
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book updated successfully", updatedBook });
    } catch (error) {
        console.error("Error updating book:", error); // Logs full error to console
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.delete("/delete-book/:id", authenticateToken, async (req, res) => {
    try {
        console.log("Headers ID:", req.headers.id);
        console.log("Params ID:", req.params.id);

        const adminUser = await User.findById(req.headers.id);
        if (!adminUser || adminUser.role !== "admin") {
            return res.status(403).json({ message: "Access Denied. Only admins can delete books." });
        }

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book deleted successfully", deletedBook });
    } catch (error) {
        console.error("Error in DELETE API:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});



router.get("/get-all-books",async(req,res)=>{
    try {
        const books = await Book.find().sort({createdAt:-1})
        return res.status(200).json({books})

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
        
    }
})

router.get("/get-recent-books",async(req,res)=>{
    try {
        const books = await Book.find().sort({createdAt:-1}).limit(4)
        return res.status(200).json({books})

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
        
    }
})

router.get("/get-book-info/:id", async (req, res) => {
    try {
        const BookId = req.params.id; // Correctly getting ID from URL
        const book = await Book.findById(BookId); // Use findById to get the book by ID

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ getbook: book });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});


module.exports = router;
