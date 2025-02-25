const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken")
const {authenticateToken} = require("./userAuth.js")

const router = express.Router();

router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        if (!username || !email || !password || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (username.length < 4) {
            return res.status(400).json({ message: "Username should be more than 4 characters" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(409).json({ message: "Username already exists" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ message: "Email already exists" });
        }

        if (password.length < 5) {
            return res.status(400).json({ message: "Password should be at least 5 characters long" });
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            address,
        });

        await newUser.save();

        return res.status(201).json({
            message: "Signup successful",
            user: newUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Sign-in Route
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log("Login attempt for:", username); // Debugging

        // Find the user by username
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        console.log("Stored hashed password:", existingUser.password);
        console.log("Entered password:", password);

        // Compare passwords
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create a token after successful authentication
        const authClaim = { name: existingUser.name, role: existingUser.role };
        const token = jwt.sign(authClaim, process.env.SECRETE_KEY, { expiresIn: "30d" });

        // Remove password before sending response
        const { password: pwd, ...userWithoutPassword } = existingUser._doc;

        return res.status(200).json({ 
            message: "Login successful", 
            userID: existingUser._id,
            role: existingUser.role,
            token: token,
            name:existingUser.username  
        });
    } catch (error) {
        console.error("Sign-in error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/get-user-info", authenticateToken, async (req, res) => {
    try {
        // Ensure req.user is available from authentication middleware
        const id = req.headers.id;  
        if (!id) {
            return res.status(400).json({ message: "User ID is missing" });
        }

        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user info:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


router.put("/update-address",authenticateToken,async(req,res)=>{

    try {
        
        const {id} = req.headers
        const {address} = req.body

        const updateadd = await User.findByIdAndUpdate(id,{address : address})
        res.status(200).json({message:"Address Updated Successfully", updateadd})

    } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
        
    }
})


router.put("/update-avatar", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { avatar } = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, { avatar }, { new: true });

        res.status(200).json({ message: "Avatar Updated Successfully", updatedUser });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;


