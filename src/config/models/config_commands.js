const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Config_commands = new Schema({
    permission: {
        type: String,
        default: 'common'
    },
    channel: {
        type: String
    },
    type: {
        type: String,
        default: 'word'
    },
    includes: {
        type: Boolean,
        default: false
    },
    name_command: {
        type: String
    },
    Message: {
        type: String
    },
    count: {
        type: Number,
        default: 0
    }

})

mongoose.model('config_commands', Config_commands)