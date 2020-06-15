const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    id: String,
    summary: String,
    location: String,
    start: String
});

module.exports = eventSchema;