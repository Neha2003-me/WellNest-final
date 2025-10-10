const express = require("express");
const router = express.Router();
const { youtubeSearchResults } = require("../services/youtube");

router.post("/", async (req, res) => {
    const { query } = req.body;
    try {
        const response = await youtubeSearchResults(query);
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

module.exports = router;