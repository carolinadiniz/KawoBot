// Module
var commands = require('./commands')
var options = require('./connection')
var tmi = require('tmi.js');





// Conection with twitch
    var client = new tmi.client(options);
    client.connect().then(()=>{
        console.log('======   tmi.js conectado com sucesso   ======')
    }).catch((err)=>{
        console.log('======   Falha ao se conectar ao tmi.js   ======')
    })
    // Conection with chat
    client.on("chat", function (channel, username, message, self) {
        new commands(client, channel, username, message, self)
    })