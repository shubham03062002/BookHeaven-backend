const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const conn = async () => {
    try {
        await mongoose.connect(process.env.MOngoDBATLASURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        if(error.code === 'ESERVFAIL'){
            console.log("You are not connected to Internet ,internet connection required, please check your network connection and try again")
        }
        process.exit(1);
    }
};

module.exports = conn;
