const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Import CORS

// Import the routes
const authRoutes = require('./routes/auth');
const signupRoutes = require('./routes/signup');
const sleepRoutes = require('./routes/sleep'); 
const waterRoutes = require('./routes/water'); 
const medicalRoutes = require('./routes/medical'); // Import the new route

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's origin for production
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add other methods as needed
    credentials: true // If you need to support cookies
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/sleep', sleepRoutes); 
app.use('/api/water', waterRoutes); 
app.use('/api/medical', medicalRoutes); // Use the medical route

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});