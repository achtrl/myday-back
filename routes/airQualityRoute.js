const express = require('express')
const router = express.Router()

// Getting air quality infos
router.get('/', (req, res) => {
    res.send('Hello World')
})

// Posting air quality infos
router.post('/', (req, res) => {

})

module.exports = router