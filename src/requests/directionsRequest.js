const directionsModel = require("../models/directions");
const getBicyclingDirection = require("./bicyclingDirectionRequest");
const getWalkingDirection = require("./walkingDirectionRequest");
const getDrivingDirection = require("./drivingDirectionRequest");
const userModel = require("../models/user");
// Stock the desired info in the DB about all the possible journey
const directions = async (googleId) => {
  const user = await userModel.findOne({ googleId: googleId });
  if (user.events.length > 0) {
    Promise.all([
      getDrivingDirection(googleId),
      getWalkingDirection(googleId),
      getBicyclingDirection(googleId),
    ]).then(async (values) => {
      const dataDrivingDirection = {
        distance_text:
          values[0].routes[0] != undefined
            ? values[0].routes[0].legs[0].distance.text
            : 0,
        distance_km:
          values[0].routes[0] != undefined
            ? values[0].routes[0].legs[0].distance.value / 1000
            : 0,
        duration_text:
          values[0].routes[0] != undefined
            ? values[0].routes[0].legs[0].duration_in_traffic.text
            : 0,
        duration_value:
          values[0].routes[0] != undefined
            ? values[0].routes[0].legs[0].duration_in_traffic.value / 60
            : 0,
        start_adress:
          values[0].routes[0] != undefined
            ? values[0].routes[0].legs[0].start_address
            : 0,
        end_adress:
          values[0].routes[0] != undefined
            ? values[0].routes[0].legs[0].end_address
            : 0,
      };
  
      const dataWalkingDirection = {
        distance_text:
          values[1].routes[0] != undefined
            ? values[1].routes[0].legs[0].distance.text
            : 0,
        distance_km:
          values[1].routes[0] != undefined
            ? values[1].routes[0].legs[0].distance.value / 1000
            : 0,
        duration_text:
          values[1].routes[0] != undefined
            ? values[1].routes[0].legs[0].duration.text
            : 0,
        duration_value:
          values[1].routes[0] != undefined
            ? values[1].routes[0].legs[0].duration.value / 60
            : 0,
        start_adress:
          values[1].routes[0] != undefined
            ? values[1].routes[0].legs[0].start_address
            : 0,
        end_adress:
          values[1].routes[0] != undefined
            ? values[1].routes[0].legs[0].end_address
            : 0,
      };
  
      const dataBicyclingDirection = {
        distance_text:
          values[2].routes[0] != undefined
            ? values[2].routes[0].legs[0].distance.text
            : 0,
        distance_km:
          values[2].routes[0] != undefined
            ? values[2].routes[0].legs[0].distance.value / 1000
            : 0,
        duration_text:
          values[2].routes[0] != undefined
            ? values[2].routes[0].legs[0].duration.text
            : 0,
        duration_value:
          values[2].routes[0] != undefined
            ? values[2].routes[0].legs[0].duration.value / 60
            : 0,
        start_adress:
          values[2].routes[0] != undefined
            ? values[2].routes[0].legs[0].start_address
            : 0,
        end_adress:
          values[2].routes[0] != undefined
            ? values[2].routes[0].legs[0].end_address
            : 0,
      };
  
      const directionData = {
        googleId: googleId,
        driving: dataDrivingDirection,
        bicycling: dataBicyclingDirection,
        walking: dataWalkingDirection,
      };
  
      const filter = { googleId: googleId };
  
      const update = directionData;
  
      await directionsModel.findOneAndUpdate(filter, update, {
        upsert: true,
      });
    });
  } else {
    console.log("Pas d'évenement prévu aujourd'hui");
  }
  
};

module.exports = directions;
