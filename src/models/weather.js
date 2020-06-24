const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const weatherInfosSchema = new Schema({
  weather_main: String,
  weather_description: String,
});

const weatherDataSchema = new Schema({
  time: String,
  temp: Number,
  feels_like: Number,
  wind_speed: Number,
  weather_infos: [weatherInfosSchema],
});

const weatherSchema = new Schema({
  googleId: String,
  current: weatherDataSchema,
  hourly: [weatherDataSchema],
});

const weatherModel = mongoose.model("weatherModel", weatherSchema);

module.exports = weatherModel;
