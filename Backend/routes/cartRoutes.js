const express = require("express");
const CartItem = require("../models/Cart");
const router = express.Router();

//  Add items in cart
router.post("/add", async (req, res) => {
  try {
    const {itemId, userId, image, name, price, quantity } = req.body;

    const newCartItem = new CartItem({itemId, userId, image, name, price, quantity });
    await newCartItem.save();

    res.status(201).json({ message: "Item added to cart successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all cart items for a particular user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from query parameters

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const cartItems = await CartItem.find({ userId }); // Filter cart items by userId
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

// Update a cart item
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {itemId, userId, image, name, price, quantity } = req.body;

    const updatedItem = await CartItem.findByIdAndUpdate(
      id,
      {itemId, userId, image, name, price, quantity },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res
      .status(200)
      .json({ message: "Cart item updated successfully", data: updatedItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Dlete a cart item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await CartItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete cart item" });
  }
});




module.exports = router;
