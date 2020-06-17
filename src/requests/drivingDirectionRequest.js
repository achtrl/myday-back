var axios = require("axios");
const userModel = require("../models/user");

async function getDrivingDirection(googleId) {
  const user = await userModel.findOne({googleId : googleId});
  return await axios
    .get("https://maps.googleapis.com/maps/api/directions/json", {
      params: {
        origin: `${user.latitude},${user.longitude}`,
        destination: "marcq_en_baroeul",
        mode: "driving",
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
}

module.exports = getDrivingDirection;
