const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

const uri = 'mongodb+srv://cmmangal523:SxQOHOrlVv5JAHYn@hts.q3tn9.mongodb.net/?retryWrites=true&w=majority&appName=HTS';
const client = new MongoClient(uri);

router.post('/', async (req, res) => {
    const { username, glasses } = req.body;

    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    try {
        await client.connect();
        const userDatabase = client.db(`user_${username}`);
        const userWaterCollection = userDatabase.collection('user_water');

        // Upsert operation: update if exists or insert if not
        await userWaterCollection.updateOne(
            { date: dateString }, // Filter by today's date
            { 
                $set: { 
                    totalIntake: glasses,
                    updatedAt: today // Optional: track when the data was last updated
                } 
            },
            { upsert: true } // Create a new document if no match is found
        );

        res.status(200).json({ message: 'Water intake recorded successfully' });
    } catch (error) {
        console.error('Error recording water intake:', error);
        res.status(500).json({ message: 'Failed to record water intake' });
    } finally {
        await client.close();
    }
});

// GET route to fetch water intake history for the last 7 days
router.get('/', async (req, res) => {
    const { username } = req.query;
    
    try {
        await client.connect();
        const userDatabase = client.db(`user_${username}`);
        const userWaterCollection = userDatabase.collection('user_water');

        // Get today's date and previous 6 days
        const today = new Date();
        const lastSevenDays = [];
        
        for (let i = 0; i < 7; i++) {
            const dateString = new Date(today);
            dateString.setDate(today.getDate() - i);
            lastSevenDays.push(dateString.toISOString().split('T')[0]); // Push formatted date
        }

        // Fetch water intake for the last 7 days
        const results = await userWaterCollection.find({ date: { $in: lastSevenDays } }).toArray();

        // Map results to an object with dates as keys
        const intakeData = {};
        results.forEach(entry => {
            intakeData[entry.date] = entry.totalIntake;
        });

        res.status(200).json({
            success: true,
            data: intakeData,
            dates: lastSevenDays // Return all dates for graph display
        });
    } catch (error) {
        console.error('Error fetching water intake history:', error);
        res.status(500).json({ message: 'Failed to fetch water intake history' });
    } finally {
        await client.close();
    }
});

module.exports = router;