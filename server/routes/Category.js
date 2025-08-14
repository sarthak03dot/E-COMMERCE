const express = require("express");
const router = express.Router();
const Category = require("../models/category");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Server Error" });
  }
});
router.post("/", async (req, res) => {
  try {
    const { name, img } = req.body;

    if (!name || !img) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({
      name: name.trim(),
      img: img.trim(),
    });

    await category.save();

    res.status(201).json({
      message: "Category added successfully",
      category,
    });
  } catch (err) {
    console.error("Error adding category:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
