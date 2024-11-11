const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Import the routes
const authRoutes = require('./routes/auth');
const signupRoutes = require('./routes/signup');
const sleepRoutes = require('./routes/sleep'); 
const waterRoutes = require('./routes/water'); 

const medicalRoutes = require('./routes/medical'); // Import the new route

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/sleep', sleepRoutes); 
app.use('/api/water', waterRoutes); 

app.use('/api/medical', medicalRoutes); // Use the medical route

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});