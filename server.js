const express = require('express');
const path = require('path');
const cors = require('cors'); // Import CORS

// Import the routes
const authRoutes = require('./routes/auth');
const signupRoutes = require('./routes/signup');
const sleepRoutes = require('./routes/sleep'); 
const waterRoutes = require('./routes/water'); 
const medicalRoutes = require('./routes/medical');
const historyRoutes = require('./routes/history');
 // Import the new route

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
const corsOptions = {
    origin: process.env.FRONTEND_ORIGIN , // Default to localhost in development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions));

// Built-in express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/sleep', sleepRoutes); 
app.use('/api/water', waterRoutes); 
app.use('/api/medical', medicalRoutes); // Use the medical route
app.use('/api/history', historyRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
