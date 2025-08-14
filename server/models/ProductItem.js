const mongoose = require("mongoose");

const productItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String }], 
  date: { type: Date, default: Date.now },
  ecoScore: { type: Number, min: 0, max: 100 },
  model: { type: String },
  year: { type: String },
  location: { type: String, default: "Bengaluru" },
  liked: { type: Boolean, default: false },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  originalPrice: { type: Number },
  description: { type: String },
  features: [{ type: String }],
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
    },
  ],
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  purchased: { type: Boolean, default: false },
});

module.exports = mongoose.model("ProductItem", productItemSchema);