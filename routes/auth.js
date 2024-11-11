const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const router = express.Router();
const uri = 'mongodb+srv://cmmangal523:SxQOHOrlVv5JAHYn@hts.q3tn9.mongodb.net/?retryWrites=true&w=majority&appName=HTS'; // Direct MongoDB connection string
const client = new MongoClient(uri);

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        await client.connect();
        const userDatabase = client.db(`user_${username}`);
        const userCollection = userDatabase.collection('user_data');

        const user = await userCollection.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Incorrect Username or Password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Incorrect Username or Password' });
        }

        res.json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Failed to log in' });
    } finally {
        await client.close();
    }
});

module.exports = router;