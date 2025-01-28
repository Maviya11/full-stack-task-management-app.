const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  availability: { type: Boolean, default: true },
});

module.exports = mongoose.model("Menu", menuSchema);
