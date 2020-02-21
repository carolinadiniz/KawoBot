const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Config_commands = new Schema({
    permission: {
        type: String
    },
    channel: {
        type: String
    },
    type: {
        type: String
    },
    includes: {
        type: Boolean
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