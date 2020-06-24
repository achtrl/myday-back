const mongoose = require("mongoose");

const directionsDataSchema = mongoose.Schema({
  distance_km: Number,
  duration_value: Number,
  start_adress: String,
  end_adress: String,
});

const directionsSchema = mongoose.Schema({
  googleId: String,
  driving: directionsDataSchema,
  bicycling: directionsDataSchema,
  walking: directionsDataSchema,
});

const directionsModel = mongoose.model("directionsModel", directionsSchema);

module.exports = directionsModel;
