const express = require("express");
const Reminder = require("../models/Reminder");
const router = express.Router();


// ➕ Add new reminder
router.post("/add-reminder", async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    await reminder.save();
    res.status(201).json({ message: "Reminder added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📋 Get reminders by email
router.post("/get-reminders", async (req, res) => {
  try {
    const { email } = req.body;
    const all = await Reminder.find({ email });
    const active = all.filter((r) => r.status === "Active");
    const history = all.filter((r) => r.status !== "Active");
    res.json({ active, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Mark reminder as taken
router.post("/mark-taken", async (req, res) => {
  try {
    const { id } = req.body;
    await Reminder.findByIdAndUpdate(id, { status: "Taken" });
    res.json({ message: "Marked as taken" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ Delete reminder
router.delete("/delete-reminder/:id", async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: "Reminder deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
