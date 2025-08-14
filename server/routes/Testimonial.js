const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");
const authMiddleware = require("../middleware/auth");
const { body, param, validationResult } = require("express-validator");

router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    res.status(500).json({ message: "Server Error" });
  }
});
router.post(
  "/testimonial",
  authMiddleware,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("text").notEmpty().withMessage("Text is required"),
    body("stars")
      .isInt({ min: 1, max: 5 })
      .withMessage("Stars must be between 1 and 5"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors
          .array()
          .map((e) => e.msg)
          .join(", "),
      });
    }
    try {
      const { title, text, stars } = req.body;
      const testimonial = new Testimonial({
        title,
        text,
        stars,
        user: req.userId,
      });
      await testimonial.save();
      res.status(201).json(testimonial);
    } catch (err) {
      console.error("Error:", err.message);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

module.exports = router;
