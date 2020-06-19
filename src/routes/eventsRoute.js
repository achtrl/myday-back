const express = require('express');
const router = express.Router();
const userModel = require('../models/user');

router.get('/', async (req, res) => {
    try {
        const user = await userModel.findOne({googleId : req.query.googleId});
        if (user === null) {
            return res.status(404).json({message: "Cannot find user"});
        }
        let eventsData = [];
        for (let i = 0; i < 2; i++) {
            user.events[i] && eventsData.push(user.events[i]);
        }
        res.json(eventsData);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;