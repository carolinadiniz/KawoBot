// Modules
const mongoose = require('mongoose')
require('../models/config_channels')
const config_channels = mongoose.model('config_channels')

//PERMISSÃO     Channel  	TYPE      	includes()	    MESSAGE 
//common	    kawo		action		true			`bla bla `		

// Conectando ao mongodb Local
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/kawobotdb', {useNewUrlParser: true, useUnifiedTopology: true})


// Configurações do canal
const newConfigChannel = {
    nome: 'Yoda',
    channel: 'yoda', //Obrigatório
}

// Adicionando Schema
new config_channels(newConfigChannel).save().then(() => {
    console.log('Schema criado com sucesso!')
}).catch((err) => {
    console.log('Falha ao criar Schema! ' + err)
})

