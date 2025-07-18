const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  passwordHash: { type: String, },
  profilePicture: { type: String, default: "" },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bio: { type: String, default: "" },
  isSuspended: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User3", userSchema);
