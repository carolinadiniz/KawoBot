// Module
const mongoose = require('mongoose')
require('../connection/Channel')
const Channel = mongoose.model('channels')
Channels = []

mongodb = Channel.find().then((channels) => {
    for (let documento of channels) {
        Channels.push(documento['slug'])
    }
}).catch((err)=>{})


var options = {
    options: {
        debug: true
    },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    identity: {
        username: "kaworii2",
        password: 'mgggjo7yfb6lihg9jek3wryj6dmfw3'
    },
    channels: Channels
};


module.exports = options