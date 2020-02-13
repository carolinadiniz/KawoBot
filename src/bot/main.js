// Modules
const mongoose = require('mongoose')
const Options = require('./config_conections')
require('./mongodb/config_channels')
var commands_ninelaris = require('./commands/commands_ninelaris')
var commands_is_kaworii = require('./commands/commands_is_kaworii')
var Config_channels = mongoose.model('config_channels')
var tmi = require('tmi.js')


// Limpar console
console.clear()


// Conectando ao Mongodb
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/kawobotdb', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('\033[0;32m[\033[0;36m'+'Mongodb \033[0;32m Conectado com Sucesso]'+'\033[0m')
}).catch((err)=>{
    console.log('\033[0;31m[\033[0;36m'+'\033[0;31mFalha ao se conectar ao MongoDB]'+'\033[0m')
})


// Tmi conectando a twitch
var client = new tmi.client(Options)
client.connect().then(()=>{
    console.log('\033[0;32m[\033[0;36m'+'tmi.js \033[0;32m Conectado com Sucesso]'+'\033[0m' )
}).catch((err)=>{
    console.log('\033[0;31m[\033[0;36m'+'tmi.js \033[0;31mFalha ao tentar se conectar]'+'\033[0m')
    console.log(err)
})


// Chat connection
client.on("chat", function (channel, username, message, self) {

    // NINELARIS
    if (channel == '#ninelaris') {
        Config_channels.findOne({channel: 'ninelaris'}).then((configs) => {
            new commands_ninelaris(client, channel, username, message, self, configs)
        }).catch()
    }

    // IS_KAWORII
    if (channel == '#is_kaworii') {
        Config_channels.findOne({channel: 'is_kaworii'}).then((configs) => {
            new commands_is_kaworii(client, channel, username, message, self, configs)
        }).catch()
    }
    
})


