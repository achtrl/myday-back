const express = require("express");
const router = express.Router();
const allRequests = require("../requests/allRequests");

router.post("/", async (req, res) => {
  try {
    allRequests(req.body.googleId);
    res.json({ message: "All requests to APIs have been done!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;