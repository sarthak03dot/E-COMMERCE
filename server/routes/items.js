const express = require("express");
const Item = require("../models/ProductItem");
const User = require("../models/User");
const Testimonial = require("../models/Testimonial");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth");
const cloudinary = require("../config/cloudinary");
const router = express.Router();
require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    const items = await Item.find().populate(
      "seller",
      "username rating ratingCount"
    );
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = [
      {
        name: "Cars",
        img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
      },
      {
        name: "Real Estate",
        img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
      },
      {
        name: "Mobiles",
        img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      },
      {
        name: "Jobs",
        img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
      },
      {
        name: "Bikes",
        img: "https://images.unsplash.com/photo-1502877338535-766e1452684a",
      },
    ];
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().populate("user", "username");
    res.json(testimonials);
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/recommended", async (req, res) => {
  try {
    const items = await Item.find()
      .populate("seller", "username rating ratingCount")
      .limit(8);
    res.json(items);
  } catch (err) {
    console.error("Error fetching recommended items:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "seller",
      "username rating ratingCount"
    );
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    console.error("Error fetching item by ID:", err);
    res.status(500).json({ error: err.message });
  }
});
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      price,
      category,
      description,
      ecoScore,
      model,
      year,
      location,
      originalPrice,
      features,
    } = req.body;

    const featuresArray = Array.isArray(features)
      ? features
      : features
      ? features.split(",")
      : [];

    let imageUrl = "";
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "items", // optional: will group uploads in Cloudinary
      });
      imageUrl = uploadResult.secure_url;
    }

    const item = new Item({
      title,
      price: Number(price),
      category,
      description,
      ecoScore: Number(ecoScore),
      model,
      year,
      location,
      originalPrice: originalPrice ? Number(originalPrice) : null,
      features: featuresArray,
      image: imageUrl,
      seller: req.userId,
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(400).json({ error: err.message });
  }
});
router.post("/favorite/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.liked = !item.liked;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error("Error toggling favorite status:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/purchase/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.purchased = true;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error("Error marking item as purchased:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/rate/:id", authMiddleware, async (req, res) => {
  try {
    const { rating } = req.body;
    if (rating === undefined || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be a number between 1 and 5" });
    }

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    const existingRatingIndex = item.ratings.findIndex(
      (r) => r.userId.toString() === req.userId
    );

    if (existingRatingIndex > -1) {
      item.ratings[existingRatingIndex].rating = rating;
    } else {
      item.ratings.push({ userId: req.userId, rating: rating });
    }

    const totalRating = item.ratings.reduce((sum, r) => sum + r.rating, 0);
    item.ratingCount = item.ratings.length;
    item.rating = item.ratingCount > 0 ? totalRating / item.ratingCount : 0;

    await item.save();

    // Update seller rating if seller exists
    const sellerId = item.seller;
    if (sellerId) {
      const sellerItems = await Item.find({ seller: sellerId });
      if (sellerItems.length > 0) {
        let totalSellerRating = 0;
        let totalSellerCount = 0;
        sellerItems.forEach((i) => {
          if (i.ratingCount > 0) {
            totalSellerRating += i.rating * i.ratingCount;
            totalSellerCount += i.ratingCount;
          }
        });
        if (totalSellerCount > 0) {
          const averageSellerRating = totalSellerRating / totalSellerCount;
          await User.findByIdAndUpdate(sellerId, {
            rating: averageSellerRating,
            ratingCount: totalSellerCount,
          });
        }
      }
    }

    res.json(item);
  } catch (err) {
    console.error("Error rating item:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/testimonial", authMiddleware, async (req, res) => {
  try {
    const { title, text, stars } = req.body;
    if (!title || !text || !stars) {
      return res.status(400).json({
        message: "Title, text, and stars are required for a testimonial",
      });
    }
    if (stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Stars must be between 1 and 5" });
    }

    const newTestimonial = new Testimonial({
      title,
      text,
      stars,
      user: req.userId,
    });
    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    console.error("Error submitting testimonial:", err);
    res.status(500).json({ error: err.message });
  }
});

// this is for add data by postman
router.post("/products", async (req, res) => {
  try {
    const savedProducts = await Item.insertMany(req.body);
    res.status(201).json(savedProducts);
  } catch (err) {
    res.status(500).json({ message: "Error adding products", error: err.message });
  }
});





module.exports = router;



