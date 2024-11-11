const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

const uri = 'mongodb+srv://cmmangal523:SxQOHOrlVv5JAHYn@hts.q3tn9.mongodb.net/?retryWrites=true&w=majority&appName=HTS';
const client = new MongoClient(uri);

// POST route for adding medical history
router.post('/', async (req, res) => {
    const { username, date, condition, reason, medications } = req.body;

    try {
        await client.connect();
        const userDatabase = client.db(`user_${username}`);
        const userHealthCollection = userDatabase.collection('user_health');

        // Insert medical history record
        const healthRecord = {
            date,
            condition,
            reason,
            medications,
            createdAt: new Date() // Optional: track when the record was created
        };

        await userHealthCollection.insertOne(healthRecord);

        res.status(200).json({ message: 'Medical history recorded successfully' });
    } catch (error) {
        console.error('Error recording medical history:', error);
        res.status(500).json({ message: 'Failed to record medical history' });
    } finally {
        await client.close();
    }
});

// GET route to fetch user's medical history
router.get('/', async (req, res) => {
    const { username } = req.query;

    try {
        await client.connect();
        const userDatabase = client.db(`user_${username}`);
        const userHealthCollection = userDatabase.collection('user_health');

        // Fetch all medical records for the user
        const records = await userHealthCollection.find({}).toArray();

        res.status(200).json({
            success: true,
            records: records || [] // Return all records or an empty array if none exist
        });
    } catch (error) {
        console.error('Error fetching medical history:', error);
        res.status(500).json({ message: 'Failed to fetch medical history' });
    } finally {
        await client.close();
    }
});

module.exports = router;