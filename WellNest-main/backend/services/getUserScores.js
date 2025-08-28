const UserScore = require("../models/UserScores");

async function getUserScores(email) {
  if (!email) throw new Error("Email is required");

  try {
    const userScore = await UserScore.findOne({ email });
    if (!userScore) return null;

    return {
      depressionScores: userScore.depressionScores, 
      anxietyScores: userScore.anxietyScores,      
      ocdScores: userScore.ocdScores,               
      wellnessScores: userScore.wellnessScores,   
    };
  } catch (err) {
    console.error("Error fetching user scores:", err);
    throw err;
  }
}

module.exports = { getUserScores };
