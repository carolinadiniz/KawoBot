const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Config_channels = new Schema({
    nome: {
        type: String
    },
    channel: {
        type: String,
        required: true
    },
    bot: {
        type: Boolean,
        default: true
    },
    filter_link: {
        type: Boolean,
        default: false
    },
    filter_link_youtube: {
        type: Boolean,
        default: false
    }

})

mongoose.model('config_channels', Config_channels)