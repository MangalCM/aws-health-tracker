const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const router = express.Router();
const uri = 'mongodb+srv://cmmangal523:SxQOHOrlVv5JAHYn@hts.q3tn9.mongodb.net/?retryWrites=true&w=majority&appName=HTS'; // Direct MongoDB connection string
const client = new MongoClient(uri);

router.post('/', async (req, res) => {
    const { username, password, gender } = req.body;
    try {
        await client.connect();
        const hashedPassword = await bcrypt.hash(password, 10);
        const userDatabase = client.db(`user_${username}`);
        const userCollection = userDatabase.collection('user_data');

        const existingUser = await userCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const userData = { username: username, password: hashedPassword, gender: gender };
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