const express = require("express");
const Menu = require("../models/Menu");
const router = express.Router();

// Add Menu Item
router.post("/add", async (req, res) => {
  try {
    const { name, image, description, category, price, rating } =
      req.body;
    const newItem = new Menu({
      name,
      image,
      description,
      category,
      price,
      rating,
    });
    await newItem.save();
    res.status(201).json({ message: "Menu item added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch Menu Items
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find();
    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
