const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Cart = require("../models/cart");
const Order = require("../models/order");

// create order
router.post("/create", async (req, res) => {
  try {
    const {
      userId,
      fullName,
      phoneNumber,
      city,
      streetAddress,
      note,
      paymentMethod,
      subtotal,
      deliveryFee,
      total,
    } = req.body;

    if (
      !userId ||
      !fullName ||
      !phoneNumber ||
      !city ||
      !streetAddress ||
      !paymentMethod
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid userId",
      });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price ?? 0,
    }));

    const order = new Order({
      userId,
      items: orderItems,
      fullName,
      phoneNumber,
      city,
      streetAddress,
      note: note || "",
      paymentMethod,
      subtotal,
      deliveryFee,
      total,
      status: "pending",
    });

    await order.save();

    // clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// get orders for one user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;