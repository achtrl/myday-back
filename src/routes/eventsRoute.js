const express = require('express');
const router = express.Router();
const userModel = require('../models/user');

router.get('/', async (req, res) => {
    try {
        const user = await userModel.findOne({id : req.query.id});
        if (user === null) {
            return res.status(404).json({message: "Cannot find user"});
        }
        res.json(user.events);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;