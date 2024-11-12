const express = require('express');
const { MongoClient } = require('mongodb');
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const router = express.Router();
const uri = 'mongodb+srv://cmmangal523:SxQOHOrlVv5JAHYn@hts.q3tn9.mongodb.net/?retryWrites=true&w=majority&appName=HTS'; // MongoDB connection string
const client = new MongoClient(uri);

// Set up AWS S3
const s3 = new AWS.S3({
    accessKeyId: 'AKIA4SZHNXMZCC6BQLWR', // Replace with your AWS Access Key
    secretAccessKey: 'cc1gQkUcPWTTRh3TPQENCkwzw0mNJ3TL4qyiSIUf', // Replace with your AWS Secret Key
    region: 'ap-south-1' // Asia Pacific (Mumbai) region
});

// Multer setup to upload files to S3
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'my-aws-health-tracker', // Replace with your S3 bucket name
        acl: 'public-read', // Make files publicly readable
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            // Give unique name to each file uploaded
            cb(null, `medical_reports/${Date.now().toString()}-${file.originalname}`);
        }
    })
});

// POST route for adding medical history with file uploads
router.post('/', upload.fields([{ name: 'medicalReport', maxCount: 1 }, { name: 'uploadImage', maxCount: 1 }]), async (req, res) => {
    const { username, date, condition, reason, medications } = req.body;

    // Get file URLs from the request
    const medicalReportUrl = req.files['medicalReport'] ? req.files['medicalReport'][0].location : null;
    const uploadImageUrl = req.files['uploadImage'] ? req.files['uploadImage'][0].location : null;

    try {
        await client.connect();
        const userDatabase = client.db(`user_${username}`);
        const userHealthCollection = userDatabase.collection('user_health');

        const healthRecord = {
            date,
            condition,
            reason,
            medications,
            medicalReportUrl,
            uploadImageUrl,
            createdAt: new Date()
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

        const records = await userHealthCollection.find({}).toArray();

        res.status(200).json({
            success: true,
            records: records || []
        });
    } catch (error) {
        console.error('Error fetching medical history:', error);
        res.status(500).json({ message: 'Failed to fetch medical history' });
    } finally {
        await client.close();
    }
});

module.exports = router;
