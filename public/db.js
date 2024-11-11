// db.js
const mongoose = require('mongoose');

// Replace <password> with your MongoDB Atlas password
const uri = "mongodb+srv://cmmangal523:SxQOHOrlVv5JAHYn@hts.q3tn9.mongodb.net/HTS?retryWrites=true&w=majority&appName=HTS";

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
