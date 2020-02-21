require('./models/config_channels')
const mongoose = require('mongoose')
const config_channels = mongoose.model('config_channels')


// LOADING CHANNELS
Channels = []
config_channels.find().then((channels) => {
    for (let channel of channels) {
        Channels.push(channel['channel'])
    }
})


// OPTIONS
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
        username: "kawobot",
        password: "mgggjo7yfb6lihg9jek3wryj6dmfw3"
    },
    channels: 
        ['itzstrikerz', 'is_kaworii', 'ninelaris']
        //Channels
}

module.exports = options