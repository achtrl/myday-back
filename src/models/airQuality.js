const mongoose = require('mongoose')


const airQualitySchema = new mongoose.Schema({
        o3 : Number,
        no2 : Number,
        pm25 : Number,
        so2 : Number,
        pm10 : Number,
        co : Number,
    
    }
)

module.exports = mongoose.model('airQuality',airQualitySchema)


