const express = require("express");
const router = express.Router();
const Journal = require("../models/Journals");

// Add a new journal entry
router.post("/add", async (req, res) => {
  try {
    const { userEmail, title, content, mood } = req.body;
    const newEntry = new Journal({ userEmail, title, content, mood });
    await newEntry.save();
    res.json({ success: true, journal: newEntry });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to save entry" });
  }
});

// Get all journal entries for a user
router.get("/:userEmail", async (req, res) => {
  try {
    const entries = await Journal.find({ userEmail: req.params.userEmail }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch entries" });
  }
});

module.exports = router;
