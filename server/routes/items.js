

const express = require("express");
const { body, param, validationResult } = require("express-validator");
const Item = require("../models/ProductItem");
const User = require("../models/User");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth");
const cloudinary = require("../config/cloudinary");
const router = express.Router();

router.get("/recommended", async (req, res) => {
  try {
    const items = await Item.find({}).limit(8);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid item ID")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: errors
            .array()
            .map((e) => e.msg)
            .join(", "),
        });
      }
      const item = await Item.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { title: { $regex: search, $options: "i" } } : {};
    const items = await Item.find(query).populate(
      "seller",
      "username rating ratingCount"
    );
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get(
  "/category/:category",
  [param("category").notEmpty().withMessage("Category is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: errors
            .array()
            .map((e) => e.msg)
            .join(", "),
        });
      }

      const { category } = req.params;

      const query = category.toLowerCase() === "all" ? {} : { category };

      const items = await Item.find(query).populate(
        "seller",
        "username rating ratingCount"
      );

      res.json(items);
    } catch (err) {
      console.error("Error fetching products by category:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.post(
  "/",
  authMiddleware,
  upload.array("images", 6),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("category").notEmpty().withMessage("Category is required"),
    body("ecoScore")
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage("EcoScore must be between 0 and 100"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: errors
            .array()
            .map((e) => e.msg)
            .join(", "),
        });
      }
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
        ? features.split(",").map((f) => f.trim())
        : [];

      const imageUrls = req.files
        ? await Promise.all(
            req.files.map((file) =>
              cloudinary.uploader.upload(file.path, { folder: "items" })
            )
          )
        : [];

      if (imageUrls.length === 0) {
        return res
          .status(400)
          .json({ error: "At least one image is required" });
      }

      const item = new Item({
        title,
        price: Number(price),
        category,
        images: imageUrls.map((upload) => upload.secure_url),
        description,
        ecoScore: ecoScore ? Number(ecoScore) : undefined,
        model,
        year,
        location,
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        features: featuresArray,
        seller: req.userId,
      });

      await item.save();
      const populatedItem = await Item.findById(item._id).populate(
        "seller",
        "username rating ratingCount"
      );
      res.status(201).json(populatedItem);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/favorite/:id",
  authMiddleware,
  [param("id").isMongoId().withMessage("Invalid item ID")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: errors
            .array()
            .map((e) => e.msg)
            .join(", "),
        });
      }
      const item = await Item.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      item.liked = !item.liked;
      await item.save();
      res.json(item);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/purchase/:id",
  authMiddleware,
  [param("id").isMongoId().withMessage("Invalid item ID")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: errors
            .array()
            .map((e) => e.msg)
            .join(", "),
        });
      }
      const item = await Item.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      item.purchased = true;
      await item.save();
      res.json(item);
    } catch (err) {
      console.error(err);
    }
  }
);

router.post(
  "/rate/:id",
  authMiddleware,
  [
    param("id").isMongoId().withMessage("Invalid item ID"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: errors
            .array()
            .map((e) => e.msg)
            .join(", "),
        });
      }
      const { rating } = req.body;
      const item = await Item.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      const existingRatingIndex = item.ratings.findIndex(
        (r) => r.userId.toString() === req.userId
      );

      if (existingRatingIndex > -1) {
        item.ratings[existingRatingIndex].rating = rating;
      } else {
        item.ratings.push({ userId: req.userId, rating });
      }

      const totalRating = item.ratings.reduce((sum, r) => sum + r.rating, 0);
      item.ratingCount = item.ratings.length;
      item.rating = item.ratingCount > 0 ? totalRating / item.ratingCount : 0;

      await item.save();

      const sellerItems = await Item.find({ seller: item.seller });
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
          await User.findByIdAndUpdate(item.seller, {
            rating: averageSellerRating,
            ratingCount: totalSellerCount,
          });
        }
      }

      res.json(item);
    } catch (err) {
      next(err);
    }
  }
);



module.exports = router;
