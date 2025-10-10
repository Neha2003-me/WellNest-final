const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const testRoutes = require('./routes/testRoutes');
const userScroresRoutes = require('./routes/userScoresRoutes');
const youtubeRoutes = require('./routes/youtubeRoutes')

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ['https://well-nest-ten.vercel.app','http://localhost:5173/loggedin', 'http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions)); 
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/tasks', taskRoutes);
app.get('/', (req, res)=>{
  res.send("Backend is up and running")
}
);
app.use("/api/test", testRoutes);
app.use("/api/user-scores", userScroresRoutes);
app.use("/api/youtube-search", youtubeRoutes);
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
