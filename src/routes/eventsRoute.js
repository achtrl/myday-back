const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
// Getting event infos from the DB
router.get("/", async (req, res) => {
  try {
    const user = await userModel.findOne({ googleId: req.query.googleId });
    if (user === null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
    let eventsData = [];
    for (let i = 0; i < 2; i++) {
			user.events[i] && (user.events[i].start = dateConverter(user.events[i].start));
      user.events[i] && eventsData.push(user.events[i]);
    }
    res.json(eventsData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Return the hour in a 'hh:mm' format from a Date type
function dateConverter(notConverted) {
  const dateNotConverted = new Date(notConverted);
  const hours = dateNotConverted.getHours();
  const minutes = "0" + dateNotConverted.getMinutes();
  const dateConverted = `${hours}` + ":" + `${minutes.substr(-2)}`;
  return dateConverted;
}

module.exports = router;
