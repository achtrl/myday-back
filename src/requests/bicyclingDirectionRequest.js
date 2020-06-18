var axios = require("axios");
const userModel = require("../models/user");

async function getBicyclingDirection(googleId) {
  const user = await userModel.findOne({ googleId: googleId });
  if (user.events.length > 0) {
    return await axios
      .get("https://maps.googleapis.com/maps/api/directions/json", {
        params: {
          origin: `${user.latitude},${user.longitude}`,
          destination: `${user.events[0].location}`,
          mode: "bicycling",
          departure_time: "now",
          key: "AIzaSyAlxisiJ5GgjtoqabOef6WSuTUOl2d4vDk",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    return "Pas d'évenement prévu pour le moment";
  }
}

module.exports = getBicyclingDirection;
