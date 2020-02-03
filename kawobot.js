// Module
const mongoose = require('mongoose')
var commands = require('./commands')
var options = require('./connection/connection')
var tmi = require('tmi.js');


// Conection with mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/kawobotdb', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('======   MongoDB Conectado   ======')
}).catch((err) => {
    console.log('===   Houve um erro ao se conectar ao mongoDB:   ===' + err)
})



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