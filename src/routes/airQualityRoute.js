const express = require("express");
const router = express.Router();
const airQuality = require("../models/airQuality");

// Getting air quality infos
router.get("/", async (req, res) => {
  try {
    const airQualityData = await airQuality.find();
    const airQualityDescription = getAirQuality(airQualityData[0].toJSON());
    res.json(airQualityDescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function getAirQuality(obj) {
  var airQualityData = {
    value: 0,
    description: "",
  };

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] > airQualityData.value) {
        airQualityData.value = obj[key];
      }
    }
  }

  if (airQualityData.value < 50) {
    airQualityData.description = "bonne";
  } else if (51 < airQualityData.value < 100) {
    airQualityData.description = "moyenne";
  } else if (100 < airQualityData.value < 200) {
    airQualityData.description = "mauvaise";
  } else {
    airQualityData.description = "dangereuse";
  }
  return airQualityData;
}

module.exports = router;
