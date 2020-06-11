const express = require("express");
const router = express.Router();
const weather = require("../models/weather");

// Getting weather infos

router.get("/", async (req, res) => {
  try {
    const weatherData = await weather.find();
    // const airQualityDescription = getAirQuality(airQualityData[0].toJSON());
    res.json(weatherData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;