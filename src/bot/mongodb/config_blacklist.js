const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Config_blacklist = new Schema({
    channel: {
        type: String
    },
    word: {
        type: String
    },
    phrase: {
        type: String
    },
    punishment: {
        type: String,
        default: 'delete'
    },
    points: {
        type: Number,
        default: 0
    }

})

mongoose.model('config_blacklist', Config_blacklist)