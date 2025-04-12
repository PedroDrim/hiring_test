const Save = require('../models/save')

exports.saveGameData = async (req, res) => {
    const { userID, gameDate, failed, difficulty, completed, timeTaken } = req.body

    try {
        if (!userID || !gameDate || failed === undefined || difficulty === undefined || completed === undefined || timeTaken === undefined) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const newSave = new Save({
            userID, // <- Warning here
            gameDate,
            failed,
            difficulty,
            completed,
            timeTaken,
        })

        await newSave.save()
        res.status(201).json({ message: 'Game data saved successfully' })
    } catch (error) {
        console.error('Error saving game data:', error)
        res.status(500).json({ message: 'Error saving game data', error })
    }
}

exports.getScoreHistory = async (req, res) => {
    try {
        const difficulty = req.params.difficulty.trim()
        const uid = req.params.uid.trim()

        if (difficulty == "" || uid == "") {
            return res.status(400).json({ message: 'Invalid field type' })
        }

        const query = await Save.find(
            {
                difficulty: { $eq: difficulty },
                userID: { $eq: uid },
                completed: { $gt: 0 }
            },
            {
                _id: 0,
                failed: 1,
                gameDate: 1,
                completed: 1,
                timeTaken: 1,
            }
        ).sort({
            gameDate: -1
        })

        res.status(201).json(query)
    } catch (error) {
        console.error('Error getting game data:', error)
        res.status(500).json({ message: 'Error getting game data', error })
    }
}