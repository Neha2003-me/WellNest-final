// models/UserScore.js
const mongoose = require("mongoose");

const UserScoreSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  depressionScores: { type: [Number], default: [] },
  anxietyScores: { type: [Number], default: [] },
  ocdScores: { type: [Number], default: [] },
  wellnessScores: { type: [Number], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

UserScoreSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("UserScore", UserScoreSchema);