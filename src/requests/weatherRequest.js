var axios = require("axios");
const userModel = require("../models/user");
const weatherModel = require("../models/weather");
 // Request to the api for the weather info on the user's location
async function getWeather(googleId) {
  const user = await userModel.findOne({googleId : googleId});
  return await axios
    .get("https://api.openweathermap.org/data/2.5/onecall", {
      params: {
        lat: `${user.latitude}`,
        lon: `${user.longitude}`,
        appid: "1cdbd1721560d97f2fb122a3eadc4d9f",
        units: "metric",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}
// Stock the desired info in the DB
const weather = (googleId) => {  
  getWeather(googleId)
    .then((response) => {
      return response;
    })
    .then(async (data) => {
      var hourlyData = [];
      hourCurrent = data.current.dt;
      for (var i = 0;i<24;i++) {
        hour = data.hourly[i].dt;
        hourlyData.push({
          time: hour != undefined ? timeConverterNumber(hour) : 0,
          temp: data.hourly[i].temp != undefined ? data.hourly[i].temp : 0,
          feels_like:
            data.hourly[i].feels_like != undefined
              ? data.hourly[i].feels_like
              : 0,
          pressure:
            data.hourly[i].pressure != undefined ? data.hourly[i].pressure : 0,
          clouds:
            data.hourly[i].clouds != undefined ? data.hourly[i].clouds : 0,
          wind_speed:
            data.hourly[i].wind_speed != undefined
              ? data.hourly[i].wind_speed
              : 0,
          weather_infos:
            data.hourly[i].weather[0] != undefined
              ? {
                  weather_main: data.hourly[i].weather[0].main,
                  weather_description: data.hourly[i].weather[0].description,
                }
              : null,
        });
      }

      const dataWeather = {  
        googleId: googleId,
        current: {
          time: hourCurrent != undefined ? timeConverterString(hourCurrent) : 0,
          sunrise:
            data.current.sunrise != undefined
              ? timeConverterString(data.current.sunrise)
              : 0,
          sunset:
            data.current.sunset != undefined
              ? timeConverterString(data.current.sunset)
              : 0,
          temp: data.current.temp != undefined ? data.current.temp : 0,
          feels_like:
            data.current.feels_like != undefined ? data.current.feels_like : 0,
          pressure:
            data.current.pressure != undefined ? data.current.pressure : 0,
          clouds: data.current.clouds != undefined ? data.current.clouds : 0,
          wind_speed:
            data.current.wind_speed != undefined ? data.current.wind_speed : 0,
          weather_infos:
            data.current.weather[0] != undefined
              ? {
                  weather_main: data.current.weather[0].main,
                  weather_description: data.current.weather[0].description,
                }
              : null,
        },
        hourly: hourlyData,
      };

      const filter = { googleId: googleId }

      const update = dataWeather;

      await weatherModel.findOneAndUpdate(filter, update, {
        upsert: true
      });
    })
    .catch((error) => console.log(error));
};

// Utilities
// convert a unix time in a hh:mm string format
function timeConverterString(unix_time) { 
  var date = new Date(unix_time * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var formattedTime = hours + ":" + minutes.substr(-2);
  return formattedTime;
}
// return the hour in a number from a unix time
function timeConverterNumber(unix_time) { 
  var date = new Date(unix_time * 1000);
  var hours = date.getHours();
  var formattedTime = hours;
  return formattedTime;
}
module.exports = weather;

