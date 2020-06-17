var axios = require("axios");
const userModel = require("../models/user");
const airQualityModel = require("../models/airQuality");

async function getAirQuality(googleId) {
  const user = await userModel.findOne({googleId : googleId});
  return await axios
    .get(
      "https://api.waqi.info/feed/geo:" +
        `${user.latitude}` +
        ";" +
        `${user.longitude}` +
        "/?token=d0356a665817869991a9a7e3333071eb0a24d1d3"
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

const airQuality = (googleId) => {
  getAirQuality(googleId)
    .then((response) => {
      return response.data;
    })
    .then(async (data) => {
      const dataAirQuality = {
        googleId: googleId,
        o3: data.iaqi.o3 != undefined ? data.iaqi.o3.v : 0,
        no2: data.iaqi.no2 != undefined ? data.iaqi.no2.v : 0,
        pm25: data.iaqi.pm25 != undefined ? data.iaqi.pm25.v : 0,
        so2: data.iaqi.so2 != undefined ? data.iaqi.so2.v : 0,
        pm10: data.iaqi.pm10 != undefined ? data.iaqi.pm10.v : 0,
        co: data.iaqi.co != undefined ? data.iaqi.co.v : 0,
      };

      const filter = { googleId: googleId }

      const update = dataAirQuality;

      await airQualityModel.findOneAndUpdate(filter, update, {
        upsert: true
      });
    })
    .catch((error) => console.log(error));
};

module.exports = airQuality;
