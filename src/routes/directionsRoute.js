const express = require("express");
const router = express.Router();
const directions = require("../models/directions");
const user = require("../models/user");
const airQualityModule = require("./airQualityRoute");
const getAirQualityData = airQualityModule.getAirQualityData;
const weather = require("../models/weather");

// Getting transport infos

router.get("/", async (req, res) => {
  try {
    const directionsData = await directions.findOne({ googleId: req.query.googleId });
    if (directionsData === null) {
      return res.status(404).json({ message: "Cannot find directions data." });
    }

    const userData = await user.findOne({ googleId: req.query.googleId });
    if (userData === null) {
      return res.status(404).json({ message: "Cannot find user." });
    }

    const weatherData = await weather.findOne({ googleId: req.query.googleId });
    if (weatherData === null) {
      return res.status(404).json({ message: "Cannot find weather data." });
    }

    const airQualityData = await getAirQualityData(req.query.googleId);
    if (airQualityData === null) {
      return res.status(404).json({ message: "Cannot find air quality data." });
    }

    var finalDirections = ''
    if (directionsData.toJSON().driving.distance_text == 0) {
      finalDirections = 'Votre évenement n\'a pas de localisation.'
    }
    else {
      finalDirections = getData(
        directionsData.toJSON(),
        userData.toJSON(),
        weatherData.toJSON(),
        airQualityData.description
      );

    }

    const timeToStart = findTimeToStart(directionsData, userData, weatherData, airQualityData)
    const finalTransportData = finalData(finalDirections,timeToStart)
    res.json(finalTransportData);
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

});

function getRemainingTime(userData) {
  var remainingTime = 0;
  for (var i = 0; i < userData.events.length; i++) {
    const eventTime = new Date(userData.events[i].start);
    const now = Date.now();
    if (Math.round((eventTime - now) / 1000) > 0) {
      remainingTime = Math.round((eventTime - now) / 1000);
      return remainingTime;
    }
  }
  return -1;
}

function getEventTime(userData) {
  var remainingTime = 0;
  for (var i = 0; i < userData.events.length; i++) {
    const eventTime = new Date(userData.events[i].start);
    const now = Date.now();
    if (Math.round((eventTime - now) / 1000) > 0) {
      remainingTime = Math.round((eventTime - now) / 1000);
      return eventTime;
    }
  }
  return -1;
}

function getPossibleDirections(remainingTime, directionsData) {
  var possibleDirections = {};
  if (remainingTime >= Math.round(directionsData.driving.duration_value * 60)) {
    possibleDirections.driving = true;
  }
  if (
    remainingTime >= Math.round(directionsData.bicycling.duration_value * 60)
  ) {
    possibleDirections.bicycling = true;
  }
  if (remainingTime >= Math.round(directionsData.walking.duration_value * 60)) {
    possibleDirections.walking = true;
  }
  return possibleDirections;
}

function getDirectionsProfile(directionsData) {
  if (Math.round(directionsData.walking.duration_value) <= 15) {
    return "court";
  } else if (Math.round(directionsData.walking.duration_value) <= 30) {
    return "moyen";
  } else {
    return "long";
  }
}

function getFinalDirection(
  possibleDirections,
  airQualityData,
  weatherData,
  userData,
  directionsData
) {
  var size = Object.keys(possibleDirections).length;
  if (size == 0) {
    return "Il est trop tard pour vous y rendre.";
  } else if (size == 1) {
    if (possibleDirections.driving) {
      return "Nous vous conseillons de prendre la voiture pour vous y rendre.";
    } else if (possibleDirections.biclycling) {
      return "Nous vous conseillons de prendre le vélo pour vous y rendre.";
    } else {
      return "Nous vous conseillons d'y aller à pied pour vous y rendre.";
    }
  } else {
    const weatherProfile = getWeatherProfile(weatherData, userData);
    const directionsProfile = getDirectionsProfile(directionsData);
    switch (
    directionsProfile +
    "-" +
    typeOfProfile(weatherProfile) +
    "-" +
    airQualityData
    ) {
      // court

      case "court-snow-mauvaise":
        return "Nous vous conseillons de prendre la voiture pour vous y rendre.";

      case "court-snow-moyenne":
        return "Nous vous conseillons de prendre la voiture pour vous y rendre.";

      case "court-snow-bonne":
        return "Nous vous conseillons d'y aller à pied pour vous y rendre.";

      case "court-rain-mauvaise":
        return "Nous vous conseillons de prendre la voiture pour vous y rendre.";

      case "court-rain-moyenne":
        return "Nous vous conseillons de prendre la voiture pour vous y rendre.";

      case "court-rain-bonne":
        return "Nous vous conseillons d'y aller à pied pour vous y rendre.";

      case "court-clear-mauvaise":
        return "Nous vous conseillons d'y aller à pied pour vous y rendre.";

      case "court-clear-moyenne":
        return "Nous vous conseillons d'y aller à pied pour vous y rendre.";

      case "court-clear-bonne":
        return "Nous vous conseillons d'y aller à pied pour vous y rendre.";

      // moyen

      case "moyen-snow-mauvaise":
        return "Nous vous conseillons de prendre la voiture pour vous y rendre.";

      case "moyen-snow-moyenne":
        return "Nous vous conseillons de prendre la voiture pour vous y rendre.";

      case "moyen-snow-bonne":
        return "Nous vous conseillons de prendre la voiture pour vous y rendre.";

      case "moyen-rain-mauvaise":
        return "Nous vous conseillons de prendre la voiture pour vous y rendre.";

      case "moyen-rain-moyenne":
        return "Nous vous conseillons de prendre la voiture pour vous y rendre.";

      case "moyen-rain-bonne":
        return "Nous vous conseillons de prendre la voiture pour vous y rendre.";

      case "moyen-clear-mauvaise":
        return "Nous vous conseillons de prendre la voiture pour vous y rendre.";

      case "moyen-clear-moyenne":
        return "Nous vous conseillons de prendre le vélo pour vous y rendre.";

      case "moyen-clear-bonne":
        return "Nous vous conseillons de prendre le vélo pour vous y rendre.";

      // long

      default:
        return "Nous vous conseillons de prendre la voiture pour vous y rendre.";
    }
  }
}

function typeOfProfile(x) {
  if (x == "Rain" || x == "Drizzle" || x == "Thunderstorm") {
    return "rain";
  } else if (x == "Snow") {
    return "snow";
  } else {
    return "clear";
  }
}



function findTimeToStart(directionsData, userData, weatherData, airQualityData) {
  const date = new Date(getEventTime(userData))
  const finalDirection = getData(directionsData, userData, weatherData, airQualityData.description)
  if (finalDirection == "Il est trop tard pour vous y rendre.") {
    return ''
  }
  else {
    if (finalDirection.includes("voiture")) {
      var travelTime = directionsData.driving.duration_value
    }
    else if (finalDirection.includes("pied")) {
      var travelTime = directionsData.walking.duration_value
    }
    else if (finalDirection.includes("vélo")) {
      var travelTime = directionsData.bicycling.duration_value
    }
    const newEventTime = date - Math.round((travelTime + 5) * 60000);
    const newDate = new Date(newEventTime);
    const hours = newDate.getHours();
    const minutes = "0" + newDate.getMinutes();
    const heure = hours + ":" + minutes.substr(-2);
    return heure;
  }
}


function getWeatherProfile(weatherData, userData) {
  var eventTime = getEventTime(userData);
  var eventHour = eventTime.getHours();
  const now = new Date();
  const nowHour = now.getHours();
  const remainingHours = eventHour - nowHour;
  return weatherData.hourly[remainingHours].weather_infos[0].weather_main;
}

function getData(directionsData, userData, weatherData, airQualityData) {
  const remainingTime = getRemainingTime(userData);
  var possibleDirections = {};
  if (remainingTime != -1) {
    possibleDirections = getPossibleDirections(remainingTime, directionsData);
  } else {
    return "Pas de trajet à déterminer pour le moment.";
  }
  const finalDirection = getFinalDirection(
    possibleDirections,
    airQualityData,
    weatherData,
    userData,
    directionsData
  );
  return finalDirection;
}

function finalData(finalDirections,timeToStart){
  return data = {
    transport : finalDirections,
    timeToStart : timeToStart
  }
}

module.exports = router;
