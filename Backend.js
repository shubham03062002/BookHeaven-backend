const express = require("express");
const cors = require("cors"); // Import cors
require("dotenv").config(); // Load environment variables
const conn = require("./Connection/conn"); // Corrected import path

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS globally

// Import routes
const userAPI = require("../Backend/Router/user");
const adminAPI = require("../Backend/Router/admin");
const FavAPI = require("../Backend/Router/favorite");
const CartAPI = require("../Backend/Router/cart");
const OrderAPI = require("./Router/orders");

// Call the connection function
conn();

// Use APIs
app.use("/user/", userAPI);
app.use("/admin/", adminAPI);
app.use("/favorite/", FavAPI);
app.use("/cart/", CartAPI);
app.use("/myorders/", OrderAPI);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`The Backend Server is listening on port ${PORT}`);
});
