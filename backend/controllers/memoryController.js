const req = require('express/lib/request');
const Save = require('../models/save');

exports.saveGameData = async (req, res) => {
    const { userID, gameDate, failed, difficulty, completed, timeTaken } = req.body;

    console.log('Received data to save:', req.body); 

    try {
       
        if (!userID || !gameDate || difficulty === undefined || completed === undefined || timeTaken === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newSave = new Save({
            userID,
            gameDate,
            failed,
            difficulty,
            completed,
            timeTaken,
        });

        await newSave.save(); 
        res.status(201).json({ message: 'Game data saved successfully' });
    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).json({ message: 'Error saving game data', error });
    }
};

exports.getHighScoreData = async (req, res) => {
    try {
        const difficulty = req.params.difficulty

        if (difficulty == null || difficulty == "" || typeof difficulty !== 'string') {
            return res.status(400).json({ message: 'Invalid field type' });
        }

        const query = await Save.aggregate([
            {$match: {
                difficulty: {$eq: difficulty}, 
                completed: {$gt: 0}
            }},

            {$lookup: {
                from: "users",
                localField: "userID",
                foreignField: "_id",
                as: "userData"
            }},

            {$unwind: "$userData"}, 

            {$project: {
                _id: 0,
                username: "$userData.username",
                failed: 1,
                completed: 1,
                timeTaken: 1,
            }},

            {$sort: {
                completed: -1,
                timeTaken: 1
            }}
        ])
        
        res.status(201).json(query);
    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).json({ message: 'Error saving game data', error });
    }
}