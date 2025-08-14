const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");
const ConnectDB = require("./config/db");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://e-commerce-rruf.onrender.com",
  "https://bd-ai-gpgoc.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
    },
  });
});
app.use(express.json());
app.use("/uploads", express.static("uploads"));
ConnectDB;
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/search", require("./routes/historyRoutes"));
app.use("/api/testimonials", require("./routes/Testimonial"));
app.use("/api/categories", require("./routes/Category"));

app.get("/", (req, res) => {
  res.send("Hello, i'm Working...");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
