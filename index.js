require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => {
  console.log(err);
});
db.once("open", () => {
  console.log("Connected to Database !");
});

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const airQualityRouter = require("./src/routes/airQualityRoute")
app.use('/api/airQuality', airQualityRouter)

const weatherRouter = require("./src/routes/weatherRoute")
app.use('/api/weather', weatherRouter);

const googleRouter = require("./src/google-util");
app.use("/google", googleRouter);

app.listen(8080, () => {
  console.log("SERVER ON");
});
