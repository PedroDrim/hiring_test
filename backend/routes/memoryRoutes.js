const express = require('express');
const { saveGameData, getHighScoreData } = require('../controllers/memoryController');
const router = express.Router();

// Route to save game data
router.post('/save', saveGameData);
router.get('/highScore/:difficulty', getHighScoreData);

module.exports = router;
