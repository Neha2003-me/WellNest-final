const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  medicine: { type: String, required: true },
  time: { type: String, required: true },
  dosage: { type: String },
  repeat: { type: String, default: "daily" },
  status: { type: String, default: "Active" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reminder", reminderSchema);
