const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

const uri = 'mongodb+srv://cmmangal523:SxQOHOrlVv5JAHYn@hts.q3tn9.mongodb.net/?retryWrites=true&w=majority&appName=HTS';
const client = new MongoClient(uri);

// POST route for adding exercise data
router.post('/', async (req, res) => {
    const { username, exercise, duration } = req.body;

    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    try {
        await client.connect();
        const userDatabase = client.db(`user_${username}`);
        const userExerciseCollection = userDatabase.collection('user_exercise');

        // Upsert operation: update if exists or insert if not
        await userExerciseCollection.updateOne(
            { date: dateString }, // Filter by today's date
            { 
                $setOnInsert: { 
                    date: dateString,
                    exercises: [], // Initialize exercises array if inserting a new document
                    totalDuration: 0 // Initialize total duration if inserting a new document
                },
                $push: { exercises: { exercise, duration } }, // Add new exercise to the array
                $inc: { totalDuration: duration } // Increment total duration for the day
            },
            { upsert: true } // Create a new document if no match is found
        );

        res.status(200).json({ message: 'Exercise recorded successfully' });
    } catch (error) {
        console.error('Error recording exercise:', error);
        res.status(500).json({ message: 'Failed to record exercise' });
    } finally {
        await client.close();
    }
});

module.exports = router;