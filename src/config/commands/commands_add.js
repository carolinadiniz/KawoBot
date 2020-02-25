const mongoose = require('mongoose')
require('../models/config_commands')
require('../models/config_lists')
require('../models/config_blacklist')
const config_commands = mongoose.model('config_commands')
const config_lists = mongoose.model('config_lists')
const config_blacklist = mongoose.model('config_blacklist')
// medo preguiça

module.exports = {
    
    add: (client, channel, username, message, user) => { console.log('./src/config/commands/commands_add'), console.log('   add:')
        let slmessage = message.toLowerCase().split(' ')
        
        // Mensagem de erro
        if (message.split(' ')[1] == undefined) { console.log('Erro ao criar comando: undefined')
            client.say(channel, 'Erro ao criar comando! -- --  Exemplo: !kcommands add "nome" "mensagem reposta"')
        }

        
        // Add command
        if (slmessage[1] == 'add') { 
            config_lists.find({channel:channel}).then((List) => {
                let List_commands = List[0]['List_commands']
                
                // Atualizar commando
                if (List_commands.includes(slmessage[2]) == true) {// slmessage[2] nome do comando
                    config_commands.findOneAndUpdate({channel: channel, name_command: slmessage[2]}, {$set:{Message: message}}, {new: true}, (err, doc) => { 
                        console.log(doc)
                        client.say(channel, `Comando Atualizado`)
                    })

                } else {
                    // Criar novo comando
                    const newCommand = {
                        channel: channel,
                        name_command: slmessage[2],
                        Message: message
                    }

                    new config_commands(newCommand).save().then(() => {
                        console.log('Novo comando Adicionado'),
                        client.say(channel, `Novo comando Adicionado`)
                        List_commands.push(slmessage[2])

                        config_lists.findOneAndUpdate({channel: channel}, {$set:{List_commands: List_commands}}, {new: true}, (err, doc) => {console.log(err),console.log(doc)})
                        
                    }).catch((err) => {
                        client.say(channel, `Erro ao criar comando`), console.log(err)}
                    )
                }
            })
        } 
        
        // DELETE
        else if (slmessage[1] == 'delete') {
            config_lists.find({channel:channel}).then((List) => {
                
                // atualizando lista
                let List_commands = List[0]['List_commands']

                List_commands.splice(List_commands.indexOf(slmessage[2]), 1)

                config_lists.findOneAndUpdate({channel: channel}, {$set:{List_commands: List_commands}}, {new: true}, (err, doc) => {console.log(err),console.log(doc)})
                
                // deletando comando
                config_commands.deleteOne({name_command: slmessage[2]}, (err) => {
                    client.say(channel, `Commando !${slmessage[2]} deletado`)
                })
            })
        }
    },


//====================================================================================================================================================================================
    setcount: (client, channel, username, message, user) => {

        if (message.split(' ')[2] == undefined) {
            client.say(channel, 'Error: Defina um comando')
        } else {
            config_lists.find({channel: channel}).then((List_commands) => {
                List_commands = List_commands[0]['List_commands']
                if (List_commands.includes(message.toLowerCase().split(' ')[1]) == true) {
                    config_commands.findOneAndUpdate({name_command: `${message.toLowerCase().split(' ')[1]}`}, {$set:{count: parseInt(message.split(' ')[2])}}, {new: true}, (err, doc) => { 
                        console.log(doc)
                        client.say(channel, `Comando Atualizado`)
                    })
                }
            })
        }
    },
//====================================================================================================================================================================================
    blacklist: (client, channel, username, message, user) => {
        slmessage = message.toLowerCase().split(' ')
        if (message.split(' ')[1] == undefined) {
            client.say(channel, '!blacklist add "frase ofensiva" "punição" "pontos"')
        
        
        } else if (slmessage[1] == 'list') {
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

            config_lists.find({channel: channel}).then((List) => {
                List_blacklist = List[0]['List_blacklist']
                

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


                if (word != null) {
                    List_blacklist.push(word)
                }
                if (frase != null) {
                    List_blacklist.push(frase)
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
                    config_lists.findOneAndUpdate({channel: channel}, {$set:{List_blacklist: List_blacklist}}, {new: true}, (err, doc) => {console.log(err),console.log(doc)})
                    if (word != null) {
                        client.say(channel, 'Palavra adicionada a blacklist com sucesso!')
                    } else {
                        client.say(channel, 'Frase adicionada a blacklist com sucesso!')
                    }
                    
                }).catch((err) => {
                    console.log('Falha ao adicionar frase a Blacklist')
                })
            })
        } else if (message.split(' ')[1].toLowerCase() == 'delete') {
            Message = message.replace(message.split(' ')[0], '').replace(message.split(' ')[1], '').replace(/^\s*/, '').toLowerCase()
            
            config_lists.find({channel: channel}).then((List) => {
                List = List[0]['List_blacklist']
                
                if (List.includes(Message) == true) {

                    if (Message.split(' ')[1] == undefined) {
                        config_lists.find({channel: channel}).then((List) => {
                            List = List[0]['List_blacklist']
                            
                            List.splice(List.indexOf(Message), 1)
                            config_lists.findOneAndUpdate({channel: channel}, {$set:{List_blacklist: List}}, {new: true}, (err, doc) => { console.log(doc)})
                            config_blacklist.deleteOne({channel: channel, word: Message}, (doc) => {
                                console.log(doc)
                                client.say(channel, 'Palavra da blacklist foi apagada')
                            })
                        })
                    }

                    if (Message.split(' ')[1] != undefined) {
                        config_lists.find({channel: channel}).then((List) => {
                            List = List[0]['List_blacklist']
                            
                            List.splice(List.indexOf(Message), 1)
                            config_lists.findOneAndUpdate({channel: channel}, {$set:{List_blacklist: List}}, {new: true}, (err, doc) => { console.log(doc)})
                            config_blacklist.deleteOne({channel: channel, phrase: Message}, (doc) => {
                                console.log(doc)
                                client.say(channel, 'Frase da blacklist foi apagada')
                            })
                        })
                    }

                } else {
                    client.say(channel, 'Palavra/frase não existe na blacklist')
                }
            })
        }
    }
}