const express = require("express");
const router = express.Router();
const weather = require("../models/weather");
const outfits = require("../models/outfits")

// Getting weather infos

router.get("/", async (req, res) => {
    try {
        const weatherData = await weather.find();
        const finalWeather = getData(weatherData[0].toJSON());
        res.json(finalWeather);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


function getTemperature(obj) {
    var temperatures = []
    var i = 0
    while (obj.hourly[i].time != 0) {
        temperatures.push(obj.hourly[i].feels_like)
        i++
    }
    return temperatures

}

function mean(data) {
    var mean = 0
    for (value of data) {
        mean += value
    }
    return mean / data.length

}

function getWeatherDescription(obj) {
    var descriptions = {
        wind_speed: [],
        weather_main: []
    }
    var i = 0
    while (obj.hourly[i].time != 0) {
        descriptions.weather_main.push(obj.hourly[i].weather_infos[0].weather_main)
        descriptions.wind_speed.push(obj.hourly[i].wind_speed)
        i++

    }
    return descriptions

}

function getMainWeatherDescription(infos) {
    if (mean(infos.wind_speed) > 14) {
        return 'Wind'
    }
    else if (infos.weather_main.includes('Rain')) {
        return 'Rain'
    }
    else if (infos.weather_main.includes('Snow')) {
        return 'Snow'
    }
    else {
        return 'Clear'
    }
}
function getTemperatureDescription(temperature) {
    if (temperature > 20) {
        return 'Hot'
    }
    else if (temperature > 10) {
        return 'Moderate'
    }
    else if (temperature > 0) {
        return 'Cold'
    }
    else {
        return 'Very_Cold'
    }
}

function getOutfit(description, temperature) {
    var outfit = ''
    switch (description + "-" + temperature) {
        case "Snow-Moderate":
            outfit = outfits.snowy.moderate
            break
        case "Snow-Cold":
            outfit = outfits.snowy.cold
            break
        case "Snow-Very_Cold":
            outfit = outfits.snowy.very_cold
            break
        case "Rain-Hot":
            outfit = outfits.rainy.hot
            break
        case "Rain-Moderate":
            outfit = outfits.rainy.moderate
            break
        case "Rain-Cold":
            outfit = outfits.rainy.cold
            break
        case "Rain-Very_Cold":
            outfit = outfits.rainy.very_cold
            break
        case "Wind-Hot":
            outfit = outfits.windy.hot
            break
        case "Wind-Moderate":
            outfit = outfits.windy.moderate
            break
        case "Wind-Cold":
            outfit = outfits.windy.cold
            break
        case "Wind-Very_Cold":
            outfit = outfits.windy.very_cold
            break
        case "Clear-Hot":
            outfit = outfits.sunny.hot
            break
        case "Clear-Moderate":
            outfit = outfits.sunny.moderate
            break
        case "Clear-Cold":
            outfit = outfits.sunny.cold
            break
        default:
            outfit = outfits.clear.moderate
            break
    }
    return outfit
}

function getFinalOutfit(weatherData) {
    const temperatures = getTemperature(weatherData)
    const meanTemperature = mean(temperatures)
    const descriptions = getWeatherDescription(weatherData)
    const mainWeatherDescription = getMainWeatherDescription(descriptions)
    const temperatureDescription = getTemperatureDescription(meanTemperature)
    const outfit = getOutfit(mainWeatherDescription, temperatureDescription)

    return outfit
}
function getFrenchDescription(description,wind_speed) {
    if (wind_speed>14){
        return 'Venteux'
    }
    switch (description) {
        case "Snow":
            return 'Enneigé'
        case "Clear":
            return 'Ensoleillé'
        case "Rain":
            return 'Pluvieux'
        default : 
            return 'Ensoleillé'   
    }
}

function getData(weatherData) {
    return data = {
        temperature: Math.round(weatherData.current.temp),
        description: getFrenchDescription(weatherData.current.weather_infos[0].weather_main,weatherData.current.wind_speed),
        outfit: getFinalOutfit(weatherData)
    }

}


module.exports = router;