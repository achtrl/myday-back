const express = require("express");
const router = express.Router();
const airQuality = require("../models/airQuality");

// Getting air quality infos
router.get("/", async (req, res) => {
  try {
    const airQualityData = await airQuality.findOne({googleId: req.query.googleId});
    const airQualityDescription = getAirQuality(airQualityData.toJSON());
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

  const { googleId, ...filteredObj } = obj;

  for (let key in filteredObj) {
    if (filteredObj.hasOwnProperty(key)) {
      if (filteredObj[key] > airQualityData.value) {
        airQualityData.value = filteredObj[key];
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

async function sendData(googleId) {
  const airQualityData = await airQuality.find({googleId: googleId});
  const airQualityDescription = getAirQuality(airQualityData);
  return airQualityDescription;
}

module.exports = {
  router: router,
  getAirQualityData: sendData,
};
