const express = require('express');
const router = express.Router();
const userModel = require('../models/user');

router.get('/', async (req, res) => {
    try {
        const user = await userModel.findOne({id : req.query.id});
        const data = getUserData(user);
        if (user === null) {
            return res.status(404).json({message: "Cannot find user"});
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

function getUserData(user) {
    const data = {};
    data.first_name = user.first_name;
    const hours = new Date().getHours();
    if (hours < 19) {
        data.message = "Bonjour";
    } else {
        data.message = "Bonsoir";
    }
    return data;
}

module.exports = router;