const mongoose = require("mongoose");

const productItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: Date, default: Date.now },
  ecoScore: { type: Number, required: true }, 
  model: { type: String }, 
  year: { type: String },
  location: { type: String, default: "Bengaluru" },
  liked: { type: Boolean, default: false }, 
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  originalPrice: { type: Number },
  description: { type: String },
  features: [{ type: String }], 
  sellerInfo: {
    name: { type: String, default: "Unknown" },
    rating: { type: Number, default: 0 },
  },
  ratings: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: Number }],
  rating: {type: Number, default: 0}, 
  ratingCount: {type: Number, default: 0},
  purchased: { type: Boolean, default: false }, 
});

module.exports = mongoose.model("ProductItem", productItemSchema);

