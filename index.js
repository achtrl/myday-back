require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);
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

const apiRequestsRouter = require("./src/routes/apiRequestsRoute");
app.use("/api/apiRequests", apiRequestsRouter);

const airQualityModule = require("./src/routes/airQualityRoute");
const airQualityRouter = airQualityModule.router;
app.use("/api/airQuality", airQualityRouter);

const weatherRouter = require("./src/routes/weatherRoute");
app.use("/api/weather", weatherRouter);

const loginRouter = require("./src/routes/loginRoute");
app.use("/api/login", loginRouter);

const eventsRouter = require("./src/routes/eventsRoute");
app.use("/api/events", eventsRouter);

const directionsRouter = require("./src/routes/directionsRoute");
app.use("/api/directions", directionsRouter);

app.listen(8080, () => {
  console.log("SERVER ON");
});
