const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();
const uri = 'mongodb+srv://cmmangal523:SxQOHOrlVv5JAHYn@hts.q3tn9.mongodb.net/?retryWrites=true&w=majority&appName=HTS'; // Direct MongoDB connection string
const client = new MongoClient(uri);

router.post('/', async (req, res) => {
    const { username, sleepHours, sleepType } = req.body;
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    try {
        await client.connect();
        const userDatabase = client.db(`user_${username}`);
        const userSleepCollection = userDatabase.collection('user_sleep');

        await userSleepCollection.updateOne(
            { date: dateString },
            { $set: { sleepHours: sleepHours, sleepType: sleepType, updatedAt: today }},
            { upsert: true }
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