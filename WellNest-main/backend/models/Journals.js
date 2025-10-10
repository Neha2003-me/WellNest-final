const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  mood: { type: String }, // e.g., Happy, Sad, Relaxed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Journal", journalSchema);
