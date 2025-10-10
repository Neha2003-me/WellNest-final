const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const testRoutes = require('./routes/testRoutes');
const userScroresRoutes = require('./routes/userScoresRoutes');
const youtubeRoutes = require('./routes/youtubeRoutes');
const reminderRoutes = require('./routes/reminderRoutes'); // 🆕 added
const nodemailer = require('nodemailer'); // 🆕 for email
const cron = require('node-cron'); // 🆕 for scheduling
const Reminder = require("./models/Reminder");
const journalRoutes = require("./routes/journalRoutes");



require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS setup
const corsOptions = {
  origin: ['https://well-nest-ten.vercel.app', 'http://localhost:5173/loggedin', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ✅ Existing routes
app.use('/api/tasks', taskRoutes);
app.use('/api/test', testRoutes);
app.use('/api/user-scores', userScroresRoutes);
app.use('/api/youtube-search', youtubeRoutes);
app.get('/', (req, res) => {
  res.send("Backend is up and running 🚀");
});

// 🆕 Medicine Reminder Route
app.use('/api/reminders', reminderRoutes);
app.use("/api/journal", journalRoutes);

// 🆕 Email and Cron setup for sending reminders
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



// 🕒 Cron Job — runs every minute to check reminders
cron.schedule('* * * * *', async () => {
  console.log('⏰ Checking reminders...');

  try {
    const reminders = await Reminder.find({ status: 'Active' });
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM" format

    for (const r of reminders) {
      if (r.time === currentTime) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: r.email,
          subject: '💊 Medicine Reminder',
          text: `Hey ${r.email.split('@')[0]}! It’s time to take your medicine: ${r.medicine} (${r.dosage || 'as prescribed'}).`,
        });
        console.log(`📧 Reminder sent to ${r.email} for ${r.medicine}`);
      }
    }
  } catch (err) {
    console.error('Error checking reminders:', err.message);
  }
});

// ✅ Start the server
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
