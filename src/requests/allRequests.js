const airQuality = require('./airQualityRequest');
const weather = require('./weatherRequest');
const directions = require('./directionsRequest');

const allRequests = (googleId) => { // Execute all Request at once
    airQuality(googleId);
    weather(googleId);
    directions(googleId);
}

module.exports = allRequests;