const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

app.get("/", (req, res) => {
  res.send("API is working");
});
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const authRoutes = require("./routes/auth");
const productsRoutes = require("./routes/products");
const favoriteRoutes = require("./routes/favorites");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const groupRoutes = require("./routes/group");
const groupPostsRoutes = require("./routes/group_posts");

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/group-posts", groupPostsRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/ingredients", require("./routes/ingredientRoutes"));
app.use("/api/medications", require("./routes/medicationRoutes"));
const productScanRoutes = require("./routes/productScanRoutes");
app.use("/api/product-scan", productScanRoutes);
const productAnalyzeRoutes = require("./routes/productAnalyzeRoutes");
app.use("/api/product-analyze", productAnalyzeRoutes);

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});