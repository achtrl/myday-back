const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    summary: String,
    location: String,
    start: String
});

module.exports = eventSchema;