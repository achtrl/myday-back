const express = require("express");
const router = express.Router();
const GoogleUtil = require("../google-util");

const userModel = require("../models/user");

const googleUtil = new GoogleUtil();

router.get("/", (req, res) => {
  res.send(googleUtil.urlGoogle());
});

router.post("/", (req, res) => {
  const userData = {};
  const code = req.body.code;
  googleUtil.getAccessTokenFromCode(code).then((response) => {

    Promise.all([googleUtil.getGoogleUserInfos(response.data.access_token), googleUtil.getGoogleCalendarEvents(response.data.access_token)])
    .then((values) => {
      var data = new Array();
      for (value of values) {
        data.push(value.data);
      }
      return data;
    })
    .then(async (data) => {
      userData.googleId = data[0].id;
      userData.first_name = data[0].given_name;
      userData.last_name = data[0].family_name;
      userData.longitude = req.body.longitude;
      userData.latitude = req.body.latitude;

      var events = new Array();
      for (event of data[1].items) {
        events.push({
          summary: event.summary,
          location: event.location,
          start: event.start.dateTime
        })
      }
      userData.events = events;
      
      const filter = { googleId: data[0].id }
      const update = userData;

      await userModel.findOneAndUpdate(filter, update, {
        upsert: true
      });
    })
  });
});

module.exports = router;
