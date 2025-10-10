const express = require("express");
const router = express.Router();
const { getUserScores } = require("../services/getUserScores");

router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const scores = await getUserScores(email);
    if (!scores) return res.status(404).json({ message: "User not found" });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
