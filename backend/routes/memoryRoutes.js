const express = require('express');
const { saveGameData, getScoreHistory } = require('../controllers/memoryController');
const router = express.Router();

// Route to save game data
router.post('/save', saveGameData);
router.get('/scoreHistory/:uid/:difficulty', getScoreHistory);

module.exports = router;
