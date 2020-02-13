const mongoose = require('mongoose')
require('./mongodb/Channel')
const Channel = mongoose.model('channels')
Channels = []

// Carregando Canais
Channel.find().then((channels)=>{
    for (let channel of channels) {
        Channels.push(channel['channel'])
    }
}).catch((err)=>{})

// TMI Options
var options = {
    options: {
        debug: true
    },
    connection: {
        cluster: "aws",
        reconnect: true,
        reconnectDecay: 1,
        reconnectInterval: 1000
    },
    identity: {
        username: "kaworii2",
        password: "mgggjo7yfb6lihg9jek3wryj6dmfw3"
    },
    channels: Channels
}

module.exports = options
