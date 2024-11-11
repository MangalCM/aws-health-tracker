const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

const uri = 'mongodb+srv://cmmangal523:SxQOHOrlVv5JAHYn@hts.q3tn9.mongodb.net/?retryWrites=true&w=majority&appName=HTS';
const client = new MongoClient(uri);

router.post('/', async (req, res) => {
    const { username, sleepHours, sleepType } = req.body;

    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    try {
        await client.connect();
        const userDatabase = client.db(`user_${username}`);
        const userSleepCollection = userDatabase.collection('user_sleep');

        // Upsert operation: update if exists or insert if not
        const result = await userSleepCollection.updateOne(
            { date: dateString }, // Filter by today's date
            { 
                $set: { 
                    sleepHours: sleepHours,
                    sleepType: sleepType,
                    updatedAt: today // Optional: track when the data was last updated
                } 
            },
            { upsert: true } // Create a new document if no match is found
        );

        res.status(200).json({ message: 'Sleep data recorded successfully' });
    } catch (error) {
        console.error('Error recording sleep data:', error);
        res.status(500).json({ message: 'Failed to record sleep data' });
    } finally {
        await client.close();
    }
});

module.exports = router;