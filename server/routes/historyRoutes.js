const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const SearchHistory = require("../models/SearchHistory");

// Save or move search term to top
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { term } = req.body;

    if (!term?.trim()) {
      return res.status(400).json({ error: "Search term is required" });
    }

    // Remove existing occurrence of the term for this user (case-insensitive)
    await SearchHistory.deleteOne({
      user: req.userId,
      term: { $regex: `^${term}$`, $options: "i" },
    });

    // Save new entry at the top
    await SearchHistory.create({
      user: req.userId,
      term: term.trim(),
    });

    // Get updated last 5 searches
    const recentSearches = await SearchHistory.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(recentSearches.map((s) => s.term));
  } catch (err) {
    console.error("Error saving search:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get last 5 searches
router.get("/recent", authMiddleware, async (req, res) => {
  try {
    const recentSearches = await SearchHistory.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(recentSearches.map((s) => s.term));
  } catch (err) {
    console.error("Error fetching search history:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
