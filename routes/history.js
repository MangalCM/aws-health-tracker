const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();
const uri = 'mongodb+srv://your-username:your-password@cluster.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri);

// GET route for fetching medical history
router.get('/', async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        await client.connect();
        const userDatabase = client.db(`user_${username}`);
        const userHealthCollection = userDatabase.collection('user_health');

        // Fetch all medical records for the user
        const records = await userHealthCollection.find({}).toArray();

        res.status(200).json(records);
    } catch (error) {
        console.error('Error fetching medical history:', error);
        res.status(500).json({ message: 'Failed to fetch medical history' });
    } finally {
        await client.close();
    }
});

module.exports = router;
    