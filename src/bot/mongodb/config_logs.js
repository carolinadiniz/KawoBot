const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Config_logs = new Schema({
    channel: {
        type: String
    },
    nick: {
        type: String
    },
    Message: {
        type: String
    },
    punishment: {
        type: String
    },
    points: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now()
    }

})

mongoose.model('config_logs', Config_logs)
