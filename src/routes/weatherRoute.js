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
        weather_main: [],
        time: []
    }
    const hoursTilMidnight = 24 - obj.hourly[0].time
    for (var i = 0; i<hoursTilMidnight; i++){
        descriptions.weather_main.push(obj.hourly[i].weather_infos[0].weather_main)
        descriptions.wind_speed.push(obj.hourly[i].wind_speed)
        descriptions.time.push(obj.hourly[i].time)
    }
    return descriptions
}

function getMainWeatherDescription(infos) {
    var data = {
        weather_main: '',
        rainTime: []
    }
    if (mean(infos.wind_speed) > 14) {
        data.weather_main = 'Wind'
    }
    else if (infos.weather_main.includes('Rain')) {
        var index = infos.weather_main.indexOf('Rain')
        var rainTime = []
        while (index != -1) {
            rainTime.push(infos.time[index])
            index = infos.weather_main.indexOf('Rain', index + 1)
        }
        data.weather_main = 'Rain'
        data.rainTime = rainTime
    }
    else if (infos.weather_main.includes('Snow')) {
        data.weather_main = 'Snow'
    }
    else {
        data.weather_main = 'Clear'
    }
    return data
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

function rainTime(infos) {
    var rainPeriod = {
        morning: false,
        afternoon: false,
        day: false
    }
    for (var i = 0; i < infos.rainTime.length; i++) {
        if (infos.rainTime[i] < 12) {
            rainPeriod.morning = true
        }
        else {
            rainPeriod.afternoon = true
        }
    }
    if (rainPeriod.morning == true && rainPeriod.afternoon == true) {
        rainPeriod.day = true
    }
    if (rainPeriod.day == true){
        return 'Pluie prévue toute la journée'
    } 
    else if (rainPeriod.morning == true){
        return 'Pluie prévue le matin'
    } 
    else if (rainPeriod.afternoon == true){
        return 'Pluie prévue l\'après-midi'
    }

}


function getOutfit(description, temperature) {
    var outfit = ''
    switch (description.weather_main + "-" + temperature) {
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
    const outfitAndPrediction = {}
    const temperatures = getTemperature(weatherData)
    const meanTemperature = mean(temperatures)
    const descriptions = getWeatherDescription(weatherData)
    const mainWeatherDescription = getMainWeatherDescription(descriptions)
    const temperatureDescription = getTemperatureDescription(meanTemperature)
    const outfit = getOutfit(mainWeatherDescription, temperatureDescription)
    outfitAndPrediction.outfit = outfit
    const rainPeriod = rainTime(mainWeatherDescription)
    outfitAndPrediction.rainPeriod = rainPeriod

    return outfitAndPrediction
}
function getFrenchDescription(description, wind_speed) {
    if (wind_speed > 14) {
        return 'venteux'
    }
    switch (description) {
        case "Snow":
            return 'enneigé'
        case "Clear":
            return 'ensoleillé'
        case "Rain":
            return 'pluvieux'
        case "Thunderstorm":
            return 'orageux'
        case "Clouds":
            return 'nuageux'
        case "Drizzle":
            return 'bruineux'
        default:
            return 'nuageux'
    }
}

function getData(weatherData) {
    const outfitAndPrediction = getFinalOutfit(weatherData)
    return data = {
        temperature: Math.round(weatherData.current.temp),
        description: getFrenchDescription(weatherData.current.weather_infos[0].weather_main, weatherData.current.wind_speed),
        outfit: outfitAndPrediction.outfit,
        prediction: outfitAndPrediction.rainPeriod
    }
s
}


module.exports = router;