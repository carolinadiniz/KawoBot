const identity = require('./identity.json')
const channels = Object.keys(require('../json/channels.json'))

module.exports = {
   options: {
      debug: true
   },
   connection: {
      reconnect: true,
      maxReconnectInterval: 1000,
      secure: true,
      timeout: 999999
   },
   identity: {
      username: identity.username,
      password: identity.password
   },
   channels: channels,
}