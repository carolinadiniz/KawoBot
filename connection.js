var channels = require('./channels')
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
    channels: channels
};


module.exports = options