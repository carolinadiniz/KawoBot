const mongoose = require('mongoose')
require('../mongodb/config_commands')
require('../mongodb/config_channels')
const config_commands = mongoose.model('config_commands')
const config_channels = mongoose.model('config_channels')
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
        for (let blacklist of Blacklist.palavra) {
            if (message.toLowerCase().split(' ').includes(blacklist) == true) {
                client.timeout(channel, username['display-name'], 600, 'Frase ofensiva')   
                client.say(channel, 'Palavra feia')
            }
        }
        for (let blacklist of Blacklist.frase) {
            if (message.toLowerCase().includes(blacklist) == true) {
                client.timeout(channel, username['display-name'], 600, 'Palavra ofensiva')
                client.say(channel, 'Frase feia')
            }
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
