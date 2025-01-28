const express = require("express");
const Order = require("../models/Order");
const Menu = require("../models/Menu");
const router = express.Router();

// Place Order
router.post("/place", async (req, res) => {
  try {
    const { userId, items } = req.body;

    // Fetch price details for each menuItem
    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const menuItem = await Menu.findById(item.menuItem);
        if (!menuItem) {
          throw new Error(`Menu item with ID ${item.menuItem} not found`);
        }
        return {
          menuItem: item.menuItem, // Keep the menuItem ID
          quantity: item.quantity,
          price: menuItem.price, // Add the price from the menu item
        };
      })
    );

    // Calculate total amount
    const totalAmount = populatedItems.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);

    // Create a new order
    const newOrder = new Order({
      userId,
      items: populatedItems.map((item) => ({
        menuItem: item.menuItem,
        quantity: item.quantity,
      })), // Save only the menuItem ID and quantity
      totalAmount,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch Orders
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).populate("items.menuItem");
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
