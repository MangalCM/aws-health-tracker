const express = require('express');
const { MongoClient } = require('mongodb');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3'); // AWS SDK v3
const path = require('path');

const router = express.Router();
const uri = 'mongodb+srv://cmmangal523:SxQOHOrlVv5JAHYn@hts.q3tn9.mongodb.net/?retryWrites=true&w=majority&appName=HTS'; // MongoDB connection string
const client = new MongoClient(uri);

// AWS S3 Configuration
const s3 = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: 'AKIA4SZHNXMZCC6BQLWR',
        secretAccessKey: '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',
    },
});

// Set up Multer storage configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST route for adding medical history (MongoDB)
router.post('/', async (req, res) => {
    const { username, date, condition, reason, medications } = req.body;

    try {
        await client.connect();
        const userDatabase = client.db(`user_${username}`);
        const userHealthCollection = userDatabase.collection('user_health');

        const healthRecord = {
            date,
            condition,
            reason,
            medications,
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

// POST route for uploading files to S3
router.post('/uploadFiles', upload.fields([{ name: 'medicalReport' }, { name: 'uploadImage' }]), async (req, res) => {
    const { medicalReport, uploadImage } = req.files;
    const fileUrls = [];

    try {
        // Upload the medical report file if it exists
        if (medicalReport && medicalReport[0]) {
            const reportKey = `medicalReports/${Date.now()}_${medicalReport[0].originalname}`;
            const params = {
                Bucket: 'my-aws-health-tracker',
                Key: reportKey,
                Body: medicalReport[0].buffer,
                ContentType: medicalReport[0].mimetype,
                // Removed ACL as it is not supported by your bucket's configuration
            };

            const command = new PutObjectCommand(params); // Create a command to put the object
            const s3Response = await s3.send(command); // Send the command
            fileUrls.push({ medicalReport: `https://my-aws-health-tracker.s3.amazonaws.com/${reportKey}` });
        }

        // Upload the image file if it exists
        if (uploadImage && uploadImage[0]) {
            const imageKey = `images/${Date.now()}_${uploadImage[0].originalname}`;
            const params = {
                Bucket: 'my-aws-health-tracker',
                Key: imageKey,
                Body: uploadImage[0].buffer,
                ContentType: uploadImage[0].mimetype,
                // Removed ACL as it is not supported by your bucket's configuration
            };

            const command = new PutObjectCommand(params); // Create a command to put the object
            const s3Response = await s3.send(command); // Send the command
            fileUrls.push({ uploadImage: `https://my-aws-health-tracker.s3.amazonaws.com/${imageKey}` });
        }

        res.status(200).json({ message: 'Files uploaded successfully', fileUrls });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ message: 'Failed to upload files' });
    }
});

module.exports = router;