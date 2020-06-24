const express = require("express");
const router = express.Router();
const airQuality = require("../models/airQuality");

// Getting air quality infos from the DataBase
router.get("/", async (req, res) => {
  try {
    const airQualityData = await airQuality.findOne({googleId: req.query.googleId});
    if (airQualityData === null) {
      return res.status(404).json({message: "Cannot find air quality data."});
    }
    const airQualityDescription = getAirQuality(airQualityData.toJSON());
    res.json(airQualityDescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Process the air quality info and return the highest index
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

// Return the processed info in the route
async function sendData(googleId) {
  const airQualityData = await airQuality.find({googleId: googleId});
  const airQualityDescription = getAirQuality(airQualityData);
  return airQualityDescription;
}

module.exports = {
  router: router,
  getAirQualityData: sendData,
};
