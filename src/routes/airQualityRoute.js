const express = require('express')
const router = express.Router()
const airQuality = require('../models/airQuality')

// Getting air quality infos
router.get('/', async (req, res) => {
    try {
        const airQualityData = await airQuality.find()
        const airQualityDescription = getAirQuality(airQualityData[0])
        res.json({ airQuality: airQualityDescription })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

function getAirQuality(obj) {
    var airQualityData = {
        value: 0,
        description: ''
    }
    delete obj._id;
    const values = Object.values(obj)
    console.log(values)
    for (const data of values) {
        if (data > airQualityData.value) {
            airQualityData.value = data
        }
    }

    if (airQualityData.value < 50) {
        airQualityData.description = 'bonne'
    }
    else if (51 < airQualityData.value < 100) {
        airQualityData.description = 'moyenne'
    }
    else if (100 < airQualityData.value < 200) {
        airQualityData.description = 'mauvaise'
    }
    else {
        airQualityData.description = 'dangereuse'
    }
    return airQualityData

}

// // Posting air quality infos
// router.post('/', (req, res) => {

// })

module.exports = router