const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  year: String,
  courses: String,
  skills: [String], // Stored as an array so AI can read them easily
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Profile", ProfileSchema);