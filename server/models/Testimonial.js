const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Testimonial", testimonialSchema);

