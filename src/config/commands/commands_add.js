const mongoose = require('mongoose')
require('../models/config_commands')
require('../models/config_blacklist')
const config_commands = mongoose.model('config_commands')
const config_blacklist = mongoose.model('config_blacklist')




module.exports = {
    add: add_commands = function (client, channel, message) {
    console.log('a2')
    // ADD
        // Undefined
        if (message.split(' ')[1] == undefined) {
            console.log('a3 1')
            client.say(channel, 'error')
        

        // ADD
        } else if (message.split(' ')[1].toLowerCase() == 'add' || message.split(' ')[1].toLowerCase() == 'mod') {
            console.log('a3')
            novo_comando = true
            command = ''
            config_commands.find().then((commands) => { // encontra comandos
                console.log('a4')
                // Verificando se o comando já existe
                for (let command of commands) {
                    console.log('a6')
                    if (message.split(' ')[2].toLowerCase() === command['name_command'] && command['channel'] == channel) {
                        console.log('a7')
                        novo_comando = false
                    }
                }


                // ADICIONANDO COMANDO
                console.log('a8')
                if (novo_comando == true) {
                    console.log('a9')
                    if (message.split(' ')[1].toLowerCase() == 'add') {
                        permission = 'common'
                    } else {
                        permission = 'mod'
                    }
                    if (message.includes('(_USER_)') || message.includes('(_TOUSER_)')) {
                        includes = true
                    } else { 
                        includes = false 
                    }


                    // Corpo do comando
                    console.log('a10')
                    const newCommand = {
                        permission: permission,
                        channel: channel,
                        type: 'word',
                        includes: includes,
                        name_command: message.split(' ')[2].toLowerCase(),
                        Message: message
                    }


                    // Cria o novo comando
                    console.log('a11')
                    new config_commands(newCommand).save().then(() => {
                        client.say(channel, `Novo comando Adicionado`)
                    }).catch((err) => {
                        client.say(channel, `Erro ao criar comando`)
                        console.log(err)
                    })

                } else {
                    console.log('a12')
                    // Atualizar comando
                    config_commands.findOneAndUpdate({name_command: `${message.split(' ')[2].toLowerCase()}`}, {$set:{Message: message}}, {new: true}, (err, doc) => { 
                        console.log('a13')
                        client.say(channel, `Comando Atualizado`)
                    })

                }

            })



        // Delete
        } else if (message.split(' ')[1].toLowerCase() == 'delete') {
            console.log('a14')
            config_commands.deleteOne({name_command: message.toLowerCase().split(' ')[2]}, (err) => {
                console.log('a15')
                client.say(channel, `Comando !${message.split(' ')[2].toLowerCase()} deletado`)
            })



        // Help
        } else if (message.split(' ')[1].toLowerCase() == 'help') {
            console.log('a16')
            client.say(channel, 'help')

        }


    },

// =============================================================================================================================================================
    setCount: setcount = function (client, channel, message) {
        console.log('b2')
        // ADD
            // Undefined
            if (message.split(' ')[2] == undefined) {
                console.log('b3')
                client.say(channel, 'error')
            

            // SETCOUNT
            } else {
                console.log('b4')
                config_commands.find().then((commands) => { // encontra comandos
                    console.log('b5')
                    // Verificando se o comando já existe
                    for (let command of commands) {
                        console.log('b6')
                        if (message.split(' ')[1].toLowerCase() === command['name_command'] && command['channel'] == channel) {
                            console.log('b7')
                            config_commands.findOneAndUpdate({name_command: `${command['name_command']}`}, {$set:{count: parseInt(message.split(' ')[2])}}, {new: true}, (err, doc) => { 
                                console.log('b8')
                                console.log(doc)
                                client.say(channel, `Comando Atualizado`)
                            })
                        }
                    }
                })
            }
    },




// =============================================================================================================================================================
    commands_blacklist: commands_blacklist = function (client, channel, username, message) {
        if (message.split(' ')[1].toLowerCase() == 'list') {
            config_blacklist.find({channel: channel}).then((blacklist) => {
                lista = ''
                for (let list of blacklist) {
                    if (list['word'] != null) {
                        lista = `${list['word']} (${list['punishment']} s), ${lista}`.replace('null, ', '')
                    }
                    if (list['phrase'] != null) {
                        lista = `${list['phrase']} (${list['punishment']} s), ${lista}`.replace('null, ', '')
                    }
                }
                client.say(channel, lista.replace('null, ', ''))
            }) 


        } else if (message.split(' ')[1].toLowerCase() == 'add') {
            Message = message.replace(message.split(' ')[0], '').replace(message.split(' ')[1], '').replace(/^\s*/, '').split(' ')
            points = Message.pop()
            punishment = Message.pop()
            frase = null
            word = null
            if (Message[1] == undefined) {
                word = `${Message}`
                frase = null
            } else {
                frase = ''
                for (let msg of Message) {
                    frase = frase + ' ' + msg
                }
                frase = frase.replace(/^\s*/, '').toLowerCase()
            }
            
            

            const newBlacklist = {
                channel: channel,
                word: word,
                phrase: frase,
                punishment:  punishment,
                points: points
            }

            new config_blacklist(newBlacklist).save().then((doc) => {
                console.log('Frase adiciona a Blacklist')
                console.log(doc)
                client.say(channel, 'Frase adicionada a blacklist com sucesso!')

            }).catch((err) => {
                console.log('Falha ao adicionar frase a Blacklist')
            })
        }

    }
    
}