const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    // Return if the user already exists
    if (existingUser) {
      return res.status(400).json({
        error: "Email/Username already exists. Try signing in.",
      });
    }

    // Create new user if not exist already
    const newUser = new User({ email, username, password });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    // Compare the password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    // Return the success message and userId
    res.status(200).json({
      message: "Login successful",
      userId: user._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
