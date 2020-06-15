const mongoose = require('mongoose');
const eventSchema = require('./event');

const userSchema = mongoose.Schema({
    id: String,
    first_name: String,
    last_name: String,
    longitude: Number,
    latitude: Number,
    events: [eventSchema]
})

module.exports = mongoose.model('user', userSchema);