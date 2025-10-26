const express = require("express");
const Reminder = require("../models/Reminder");
const router = express.Router();
const nodemailer = require("nodemailer");

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

// 🕒 Check reminders — for Vercel + external scheduler
router.get("/check-reminders", async (req, res) => {
  try {
    const reminders = await Reminder.find({ status: "Active" });
    const now = new Date();

    // Convert UTC to IST
    const istHours = (now.getUTCHours() + 5 + Math.floor((now.getUTCMinutes() + 30)/60)) % 24;
    const istMinutes = (now.getUTCMinutes() + 30) % 60;
    const pad = (n) => n.toString().padStart(2, "0");
    const currentTime = `${pad(istHours)}:${pad(istMinutes)}`;

    console.log("Checking reminders at IST time:", currentTime);

    for (const r of reminders) {
      if (r.time === currentTime) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: r.email,
          subject: "💊 Medicine Reminder",
          text: `Hey ${r.email.split("@")[0]}! It’s time to take your medicine: ${r.medicine} (${r.dosage || "as prescribed"}).`,
        });
        console.log(`📧 Reminder sent to ${r.email} for ${r.medicine}`);
      }
    }

    res.json({ message: "Checked reminders" });
  } catch (err) {
    console.error("Error checking reminders:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
