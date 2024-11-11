const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const router = express.Router();

const uri = 'mongodb+srv://cmmangal523:SxQOHOrlVv5JAHYn@hts.q3tn9.mongodb.net/?retryWrites=true&w=majority&appName=HTS';
const client = new MongoClient(uri);

router.post('/', async (req, res) => {
    const { username, password, gender } = req.body;

    try {
        await client.connect();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new database for each user using their username
        const userDatabase = client.db(`user_${username}`);
        
        // Create collections for user data, sleep data, water data, and health data
        const userCollection = userDatabase.collection('user_data');
        const userSleepCollection = userDatabase.collection('user_sleep');
        const userWaterCollection = userDatabase.collection('user_water');
        const userHealthCollection = userDatabase.collection('user_health'); // New collection for health data

        // Check if the username already exists
        const existingUser = await userCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Insert the user's data
        const userData = {
            username: username,
            password: hashedPassword,
            gender: gender,
        };

        await userCollection.insertOne(userData);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Failed to create user' });
    } finally {
        await client.close();
    }
});

module.exports = router;