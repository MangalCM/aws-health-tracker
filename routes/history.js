const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();
const uri = 'mongodb+srv://cmmangal523:SxQOHOrlVv5JAHYn@hts.q3tn9.mongodb.net/?retryWrites=true&w=majority&appName=HTS'; // MongoDB connection string
const client = new MongoClient(uri);

// GET route for fetching medical history
router.get('/medical', async (req, res) => {
    const { username } = req.query; // Get username from query parameters

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        await client.connect();
        const userDatabase = client.db(`user_${username}`); // Connect to the user's database
        const userHealthCollection = userDatabase.collection('user_health'); // Access user_health collection

        // Fetch all medical records for the user
        const records = await userHealthCollection.find({}).toArray();
        
        res.status(200).json(records); // Return records as JSON
    } catch (error) {
        console.error('Error fetching medical history:', error);
        res.status(500).json({ message: 'Failed to fetch medical history' });
    } finally {
        await client.close();
    }
});

module.exports = router;