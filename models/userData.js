const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    bmi: { type: Number, required: true }
});

// Export the model for use in routes
const UserData = mongoose.model('user_data', userDataSchema);
module.exports = UserData;
