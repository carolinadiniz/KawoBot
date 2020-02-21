const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Config_lists = new Schema({
    channel: {
        type: String
    },
    List_blacklist: {
        type: Object
    },
    List_commands: {
        type: Object
    },
    List_nick_logs: {
        type: Object
    }

})

mongoose.model('lists', Config_lists)