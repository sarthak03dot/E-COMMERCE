const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");
const ConnectDB = require("./config/db");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: "https://bd-ai-gpgoc.onrender.com",
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true,
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));
ConnectDB;
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/search", require("./routes/historyRoutes"));

app.get("/", (req, res) => {
  res.send("Hello, i'm Working...");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
