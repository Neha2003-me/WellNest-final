const UserScore = require('../models/UserScores');

async function saveWellnessScore(email, score) {
    if (!email || score === undefined) {
        throw new Error("Email and score are required");
    }

    try {
        const updatedRecord = await UserScore.findOneAndUpdate(
            { email }, 
            { $push: { wellnessScores: score } },
            { upsert: true, new: true } 
        );
        return updatedRecord;
    } catch (err) {
        console.error(err);
        throw new Error("Database error");
    }
}
async function saveDepressionScore(email, score) {
    if (!email || score === undefined) {
        throw new Error("Email and score are required");
    }

    try {
        const updatedRecord = await UserScore.findOneAndUpdate(
            { email }, 
            { $push: { depressionScores: score } },
            { upsert: true, new: true } 
        );
        return updatedRecord;
    } catch (err) {
        console.error(err);
        throw new Error("Database error");
    }
}

async function saveAnxietyScore(email, score) {
    if (!email || score === undefined) {
        throw new Error("Email and score are required");
    }

    try {
        const updatedRecord = await UserScore.findOneAndUpdate(
            { email }, 
            { $push: { anxietyScores: score } },
            { upsert: true, new: true } 
        );
        return updatedRecord;
    } catch (err) {
        console.error(err);
        throw new Error("Database error");
    }
}

async function saveOcdScore(email, score) {
    if (!email || score === undefined) {
        throw new Error("Email and score are required");
    }

    try {
        const updatedRecord = await UserScore.findOneAndUpdate(
            { email }, 
            { $push: { ocdScores: score } },
            { upsert: true, new: true } 
        );
        return updatedRecord;
    } catch (err) {
        console.error(err);
        throw new Error("Database error");
    }
}

module.exports = { saveDepressionScore, saveAnxietyScore, saveOcdScore, saveWellnessScore };