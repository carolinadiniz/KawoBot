const mongoose = require('mongoose')
require('../mongodb/config_logs')
require('../mongodb/config_commands')
require('../mongodb/config_channels')
require('../mongodb/config_blacklist')
const config_log = mongoose.model('config_logs')
const config_commands = mongoose.model('config_commands')
const config_channels = mongoose.model('config_channels')
const config_blacklist = mongoose.model('config_blacklist')
const Blacklist = require('../mongodb/blacklist')


mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/kawobotdb', {useNewUrlParser: true, useUnifiedTopology: true})
/**message = '!amor @Soraka'
message = '!command delete amor Há [_PERCENT_] de <3 entre [_USER_] e [_TOUSER_]'*/


chat = function (client, channel, username, message, self, configs) {
    if (self) { return; }

    // VERIFICA SE O BOT ESTÁ ATIVO NO CANAL
    if (configs['bot'] == true) {

        // COMMAND
        if (message.split(' ')[0][0].includes('!') == true) {
            
            // MOD COMMANDS
            if (username['mod'] == true || username['badges']['broadcaster'] == '1'){

                // ADD COMMAND
                if (message.split(' ')[0].toLowerCase() == '!kcommand') {

                    // ADD
                    if (message.split(' ')[1].toLowerCase() == 'add') {
                        novo_comando = true
                        config_commands.find().then((commands) => { 

                            // Verificando se o comando já existe
                            for (let command of commands) {
                                if (message.split(' ')[2] === command['name_command'] && command['channel'] == channel) {
                                    novo_comando = false
                                    console.log(`COMANDO <${message.split(' ')[2]}> JÁ EXISTENTE`)
                                } 
                            }
                            
                            // ADICIONANDO COMANDO
                            if (novo_comando == true) {
                                console.log(`NOVO COMANDO ADICIONADO: <${message.split(' ')[2]}>`)
                                permission = 'common'
                                type = 'say'
                                if (message.includes('[_USER_]') || message.includes('[_TOUSER_]')) {
                                    includes = true
                                } else {
                                    includes = false
                                }
                                
                                // Corpo do comando
                                const newCommand = {
                                    permission: permission,
                                    channel: channel,
                                    type: type,
                                    includes: includes,
                                    name_command: message.split(' ')[2],
                                    Message: message
                                }
                                
                                // Dispara o comando
                                new config_commands(newCommand).save().then(() => {
                                    console.log('Schema criado com sucesso!')
                                }).catch((err) => {
                                    console.log('Falha ao criar Schema!')
                                })

                                client.say(channel, 'Novo comando Adicionado!')
                            
                            } else {

                                config_commands.findOneAndUpdate({name_command: `${message.toLowerCase().split(' ')[2]}`}, {$set:{Message: message}}, {new: true}, (err, doc) => { console.log(doc) })
                                client.say(channel, 'Comando atualizado')
                                
                            }
                        })
                        
                    }

                    // DELETE
                    if (message.split(' ')[1].toLowerCase() == 'delete') {
                        config_commands.deleteOne({name_command: message.toLowerCase().split(' ')[2]}, (err) => {
                            client.say(channel, `Comando !${message.split(' ')[2].toLowerCase()} deletado`)
                        })
                    }
                }


                // BLACKLIST COMMAND
                if (message.split(' ')[0].toLowerCase() == '!blacklist') {
                    if (message.split(' ')[1].toLowerCase() == 'list') {
                        console.log('AAAAAAA LISTA AAAAAAAAAA')
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

            // COMMON COMMANDS
            config_commands.find().then((cmds) => {
                for (let cmd of cmds) {

                    // CHANNEL
                    if (cmd['channel'] == channel) {

                        // Comandos
                        allcommands = ''
                        for (let cmd of cmds) {if (cmd['permission'] == 'common' && cmd['channel'] == channel) {allcommands = allcommands + (cmd['name_command']) + ', '}}

                        // mensagem pura
                        Message = cmd['Message'].replace(cmd['Message'].split(' ')[0], '').replace(cmd['Message'].split(' ')[1], '').replace(cmd['Message'].split(' ')[2], '').replace(/^\s*/, '')
                        Message = Message.replace('(_USER_)', `${username['display-name']}`)
                        Message = Message.replace('(_PERCENT_)', `${Math.ceil(Math.random(0, 101) * 100)}%`)
                        Message = Message.replace('(_TOUSER_)', `${message.replace(message.split(' ')[0], '').replace(/^\s*/, '')}`)
                        Message = Message.replace('(_COMMANDS_)', `${allcommands}`)


                        // MOD COMMANDS
                        if (cmd['permission'] == 'mod' && username['mod'] == true || cmd['permission'] == 'mod' && username['badges']['broadcaster'] == '1') {
                            if (message.toLowerCase().split(' ')[0].substr(1) == cmd['name_command']) {
                                client.say(channel, Message)
                            }
                        }

                        // COMMON COMMANDS
                        if (cmd['permission'] == 'common') {
                            if (message.toLowerCase().split(' ')[0].substr(1) == cmd['name_command']) {
                                client.say(channel, Message)
                            }
                        }
                    }
                }
            })
        }


        // NON COMMAND
        // Blacklist
        config_blacklist.find({channel: channel}).then((Blacklist) => {
            for (let blacklist of Blacklist) {
                if (message.toLowerCase().includes(blacklist['phrase']) == true) {
                    config_log.find({channel: channel}).then((Logs) => {
                        if (Logs[0] == undefined) {
                            const newLog = {
                                channel: channel,
                                nick: `${username['display-name']}`,
                                Message: message + ` (${blacklist['punishment']})(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()})`,
                                punishment: blacklist['punishment'],
                                points: 100 - blacklist['points'],
                                date: Date()
                            }
                            
                            new config_log(newLog).save().then((doc) => {
                                console.log(doc)
                            }).catch(() => {
                                console.log('Falha ao adicionar novo usuário ao log')
                            })
                        }
                                            
                        for (let logs of Logs) {
                            console.log('3')
                            if (username['display-name'] == logs['nick']) {
                                config_log.findOneAndUpdate({nick: username['display-name']},{$set: {
                                    Message: `${logs['Message']} | ${message + ` (${blacklist['punishment']})(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()})`}`, 
                                    punishment: `${logs['punishment']}, ${blacklist['punishment']}`,
                                    date: new Date(),
                                    points: parseInt(logs['points']) - parseInt(blacklist['points'])
                                }}, {new: true}, (err, doc) => { console.log(doc) })

                                
                            } else {
                                console.log('4')
                                const newLog = {
                                    channel: channel,
                                    nick: `${username['display-name']}`,
                                    Message: message + ` (${blacklist['punishment']})(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()})`,
                                    punishment: blacklist['punishment'],
                                    points: 100 - blacklist['points'],
                                    date: Date()
                                }
                                
                                new config_log(newLog).save().then((doc) => {
                                    console.log(doc)
                                }).catch(() => {
                                    console.log('Falha ao adicionar novo usuário ao log')
                                })
                            }
                        }

                        if (blacklist['punishment'] == 'delete') {
                            client.deletemessage(channel, username['id'])
                        }
                        if (blacklist['punishment'] == 'ban') {
                            client.ban(channel, username['display-name'], 'banido pela utilização de frase extremamente ofensiva')
                        }
                        if (blacklist['punishment'] != 'ban' && blacklist['punishment'] != 'delete') {
                            punishment = parseInt(blacklist['punishment'])
                            client.timeout(channel, username['display-name'], punishment,'timeouted por usar frase ofensiva')
                        }
                        if (blacklist['points'] <= 0) {
                            config_log.findOneAndUpdate({nick: username['display-name']},{$set: {
                                Message: `${logs['Message']} | ${message + ` (${blacklist['punishment']})(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()})`}`, 
                                punishment: `${logs['punishment']}, ${blacklist['punishment']}`,
                                date: new Date(),
                                points: parseInt(logs['points']) - parseInt(blacklist['points'])
                            }}, {new: true}, (err, doc) => { console.log(doc) })

                            client.ban(channel, username['display-name'], 'banido por histórico ruim no canal')

                        }
                    })
                }
                // =========================================================================================================================================================================
                if (message.toLowerCase().split(' ').includes(blacklist['word']) == true) {
                    config_log.find({channel: channel}).then((Logs) => {
                        if (Logs[0] == undefined) {
                            const newLog = {
                                channel: channel,
                                nick: `${username['display-name']}`,
                                Message: message + ` (${blacklist['punishment']})(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()})`,
                                punishment: blacklist['punishment'],
                                points: parseInt(logs['points']) - parseInt(blacklist['points']),
                                date: Date()
                            }
                            
                            new config_log(newLog).save().then((doc) => {
                                console.log(doc)
                            }).catch(() => {
                                console.log('Falha ao adicionar novo usuário ao log')
                            })
                        }
                                            
                        for (let logs of Logs) {
                            console.log('3')
                            if (username['display-name'] == logs['nick']) {
                                config_log.findOneAndUpdate({nick: username['display-name']},{$set: {
                                    Message: `${logs['Message']} | ${message + ` (${blacklist['punishment']})(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()})`}`, 
                                    punishment: `${logs['punishment']}, ${blacklist['punishment']}`,
                                    date: new Date()
                                }}, {new: true}, (err, doc) => { console.log(doc) })

                                
                            } else {
                                console.log('4')
                                const newLog = {
                                    channel: channel,
                                    nick: `${username['display-name']}`,
                                    Message: message + ` (${blacklist['punishment']})(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()})`,
                                    punishment: blacklist['punishment'],
                                    points: 100 - blacklist['points'],
                                    date: Date()
                                }
                                
                                new config_log(newLog).save().then((doc) => {
                                    console.log(doc)
                                }).catch(() => {
                                    console.log('Falha ao adicionar novo usuário ao log')
                                })
                            }
                        }

                        if (blacklist['punishment'] == 'delete') {
                            client.deletemessage(channel, username['id'])
                        }
                        if (blacklist['punishment'] == 'ban') {
                            client.ban(channel, username['display-name'], 'banido por usar palavra extremamente ofensiva')
                        }
                        if (blacklist['punishment'] != 'ban' && blacklist['punishment'] != 'delete') {
                            punishment = parseInt(blacklist['punishment'])
                            client.timeout(channel, username['display-name'], punishment,'timeouted por usar palavra ofensiva')
                        }
                        if (blacklist['points'] <= 0) {
                            config_log.findOneAndUpdate({nick: username['display-name']},{$set: {
                                Message: `${logs['Message']} | ${message + ` (${blacklist['punishment']})(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()})`}`, 
                                punishment: `${logs['punishment']}, ${blacklist['punishment']}`,
                                date: new Date(),
                                points: parseInt(logs['points']) - parseInt(blacklist['points'])
                            }}, {new: true}, (err, doc) => { console.log(doc) })

                            client.ban(channel, username['display-name'], 'banido por histórico ruim no canal')

                        }
                    })
                }
            }
        })
        


        if (message == 'a') {
            client.say(channel, '/unban is_kaworii')
        }



    }

    // OFF BOT
    if (message == '!kawobot on' && username['mod'] == true || message == '!kawobot on' && username['badges']['broadcaster'] == '1') {
        config_channels.findOneAndUpdate({channel: channel.substr(1)}, {$set:{bot: true}}, {new: true}, (err, doc) => {console.log(doc)})
        client.action(channel, ' Kawobot Ativado')
    }
    if (message == '!kawobot off' && username['mod'] == true || message == '!kawobot off' && username['badges']['broadcaster'] == '1') {
        config_channels.findOneAndUpdate({channel: channel.substr(1)}, {$set:{bot: false}}, {new: false}, (err, doc) => {console.log(doc)})
        client.action(channel, ' Kawobot Desativado')
    }

}

module.exports = chat
