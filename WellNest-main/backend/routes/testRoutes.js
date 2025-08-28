const express = require('express');
const router = express.Router();
const { saveDepressionScore, saveAnxietyScore, saveOcdScore, saveWellnessScore } = require('../services/saveTestScores');

const scoreRoutes = [
    { path: "/depression-score", handler: saveDepressionScore },
    { path: "/anxiety-score", handler: saveAnxietyScore },
    { path: "/ocd-score", handler: saveOcdScore },
    { path: "/wellness-score", handler: saveWellnessScore },
];

scoreRoutes.forEach(({ path, handler }) => {
    router.post(path, async (req, res) => {
        const { email, score } = req.body;

        if (!email || score === undefined) {
            return res.status(400).json({ message: "Email and score are required" });
        }

        try {
            const updatedRecord = await handler(email, Number(score));
            res.status(200).json({ message: "Score saved successfully", data: updatedRecord });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    });
});

module.exports = router;