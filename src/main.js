// MODULOS
console.clear()
const tmi = require('tmi.js')
const mongoose = require('mongoose')

require('./config/models/config_channels')
const options = require('./config/config_connection')
var chat = require('./chat')
var commands_kaworii = require('./config/commands/commands_kaworii')
var Channel = mongoose.model('config_channels')




// MONGOOSE  
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/kawobotdb', {useNewUrlParser: true, useUnifiedTopology: true}).then(() =>
console.log('\033[0;32m[\033[0;36m'+'Mongodb \033[0;32m Conectado com Sucesso]'+'\033[0m')).catch(() =>
console.log('\033[0;31m[\033[0;36m'+'\033[0;31mFalha ao se conectar ao MongoDB]'+'\033[0m')
)





// TMI.JS
var client = new tmi.client(options)
client.connect().then(() => 
    console.log('\033[0;32m[\033[0;36m'+'tmi.js \033[0;32m Conectado com Sucesso]'+'\033[0m')).catch(() =>
    console.log('\033[0;31m[\033[0;36m'+'tmi.js \033[0;31mFalha ao tentar se conectar]'+'\033[0m')
)



// CHAT
client.on('chat', function (channel, username, message, self) {

    Channel.find({channel: channel}).then((config_channel) => {
        if (message.toLowerCase().split(' ')[0].includes('!kaworiiadmin') == true && username['display-name'] == 'is_Kaworii') {
            new commands_kaworii(client, channel, username, message, self)
        }
        if (config_channel[0]['bot'] == true) {
            new chat(client, channel, username, message, self)
        }
    })
    

}) 