const router = require("express").Router()
const User = require("../models/user")
const { authenticateToken } = require("./userAuth.js");

router.put("/add-to-fav",authenticateToken,async(req,res)=>{
    try {
        const {bookid,id}= req.headers;
        const userData = await User.findById(id);
        if(userData){
            const isfavbk = userData.favourites.includes(bookid);
            if(isfavbk){
                return res.status(200).json({message:"Book Is Already In Favorites"})
            }
            await User.findByIdAndUpdate(id,{ $push:{favourites:bookid}})
            return res.status(200).json({message:"Book Added to Favorites"})
        }
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"})
        
    }
})


router.put("/remove-from-fav",authenticateToken,async(req,res)=>{
    try {
        const {bookid,id}= req.headers;
        const userData = await User.findById(id);
        if(userData){
            const isfavbk = userData.favourites.includes(bookid);
            if(isfavbk){
                await User.findByIdAndUpdate(id,{ $pull:{favourites:bookid}})
                return res.status(200).json({messaage:"Book Removed From Favorites"})
            }
        }
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"})
        
    }
})

router.get("/favorites", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate("favourites"); // Assuming 'favourites' stores book IDs

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ favourites: userData.favourites });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router