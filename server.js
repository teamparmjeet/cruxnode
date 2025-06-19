const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors"); // ✅ added
const bodyParser = require("body-parser");
const authenticateToken = require("./middleware/auth");

// ✅ Use CORS before routes
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 4000;

// Import routes
const userRoutes = require("./routes/userRoutes");
const reelRoute = require("./routes/reelRoutes");
const musicRoute = require("./routes/musicRoutes");
const commentRoute = require("./routes/commentRoute");

app.use("/api/users", userRoutes);
app.use("/api/reels", authenticateToken, reelRoute);
app.use("/api/music", authenticateToken, musicRoute);
app.use("/api/comment", authenticateToken, commentRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
