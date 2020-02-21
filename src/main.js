console.clear()
// MODULES
require('./config/models/config_channels')
const options = require('./config/config_connections')
const mongoose = require('mongoose')

var config_channels = mongoose.model('config_channels')
var commands = require('./config/commands/config_commands')
var tmi = require('tmi.js')



// MONGOOSE
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/kawobotdb', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('\033[0;32m[\033[0;36m'+'Mongodb \033[0;32m Conectado com Sucesso]'+'\033[0m')
}).catch((err)=>{
    console.log('\033[0;31m[\033[0;36m'+'\033[0;31mFalha ao se conectar ao MongoDB]'+'\033[0m')
})



// TMI.JS
var client = new tmi.client(options)
client.connect().then(() => {
    console.log('\033[0;32m[\033[0;36m'+'tmi.js \033[0;32m Conectado com Sucesso]'+'\033[0m' )
}).catch((err)=>{
    console.log('\033[0;31m[\033[0;36m'+'tmi.js \033[0;31mFalha ao tentar se conectar]'+'\033[0m'), console.log(err)
})


// CHAT
client.on("chat", function (channel, username, message, self) {
    add = 'on'
    // IS_KAWORII
    if (channel == '#is_kaworii') {
        if (add == 'off') {
            config_channels.findOne({channel: '#ninelaris'.substr(1)}).then((configs) => {
                new commands(client, '#ninelaris', username, message, self, configs)
                
            }).catch()
        } else { 
            
            config_channels.findOne({channel: channel.substr(1)}).then((configs) => {
            new commands(client, channel, username, message, self, configs)
            
            }).catch()
        }
    }
    
    // NINELARIS
    if (channel == '#ninelaris') {
        config_channels.findOne({channel: channel.substr(1)}).then((configs) => {
            new commands(client, channel, username, message, self, configs)
        })
    }


    // ITZSTRIKERZ
    if (channel == '#itzstrikerz') {
        config_channels.findOne({channel: channel.substr(1)}).then((configs) => {
            new commands(client, channel, username, message, self, configs)
        })
    }

    
    
})

