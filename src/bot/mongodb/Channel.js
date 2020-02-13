const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Channel = new Schema({
    nome: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('channels', Channel)
