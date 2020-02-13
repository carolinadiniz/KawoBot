const mongoose = require('mongoose')
require('../mongodb/config_channels')
const Config = mongoose.model('config_channels')
const BlackList = require('../mongodb/blacklist')

var red, cyan, yel, green, reset, lastTimeout
red = '\033[31m'
cyan = '\033[36m'
yel = '\033[1;33m'
green = '\033[0;32m'
reset = '\033[0m' 
lastTimeout = {}
WL = BlackList.whitelist
mod = false
allcommands = []


chat = function (client, channel, username, message, self, configs, Config_channels) {
    // Verificar se está ativado no canal
    if (configs['bot'] == true) {
        
        // COMMAND
        if (message.includes('!') == true) {
            
            // MOD COMMAND
            if (username['mod'] == true || username['badges']['broadcaster'] == 1) {

                message = message.toLowerCase()
                command = '!mod?'
                if (message == command) {
                    client.action(channel, `@${username['display-name']} possui mod`)
                    console.log(cyan + `Comando admin solicitado por ${yel + username['display-name']}: ${green + command}` + reset)
                }

                command = '!mod?true!'
                if (message == command) {
                   mod = true 
                   console.log('MOD TRUE')
                }

                command = '!mod?false!'
                if (message == command) {
                    mod = false
                    console.log('MOD FALSE')
                }

                command = '!mod?configs'
                if (message == command) {
                    client.say(channel, `bot: ${configs['bot']} | filter_link: ${configs['filter_link']} | filter_link_youtube: ${configs['filter_link_youtube']} `)
                }
                
                command = '!mod?configs!'
                if (message == command) {
                   console.log(`bot: ${configs['bot']} | filter_link: ${configs['filter_link']} | filter_link_youtube: ${configs['filter_link_youtube']} `)
                }

                command = '!disconnect kawobot'
                if (message == command) {
                    client.say(channel, 'KawoBot Disconnected')
                    client.disconnect()
                    console.log(red + `Comando admin solicitado por ${yel + username['display-name']}` + red + ': ' + `${red + command}` + reset)
                }

                command = '!emote on'
                if (message == command) {
                    client.say(channel, '/emoteonly')
                    console.log(cyan + `Comando admin solicitado por ${yel + username['display-name']}: ${green + command}` + reset)
                }

                command = '!emote off'
                if (message == command) {
                    client.say(channel, '/emoteonlyoff')
                    console.log(cyan + `Comando admin solicitado por ${yel + username['display-name']}: ${green + command}` + reset)
                }

                command = '!flink on'
                if (message == command) {
                    Config.findOneAndUpdate({channel: 'ninelaris'}, {$set:{filter_link: true}}, {new: true}, (err, doc) => {console.log(doc)})
                    client.action(channel, 'Filtro de links: ON')
                    console.log(cyan + `Comando admin solicitado por ${yel + username['display-name']}: ${green + command}` + reset)
                }
                
                command = '!flink off'
                if (message == command) {
                    Config.findOneAndUpdate({channel: 'ninelaris'}, {$set:{filter_link: false}}, {new: true}, (err, doc) => {console.log(doc)})
                    client.action(channel, 'Filtro de links: OFF')
                    console.log(cyan + `Comando admin solicitado por ${yel + username['display-name']}: ${green + command}` + reset)
                }

                command = '!link'
                if (message == command) {
                    client.say(channel, 'Mesagem de @' + lastMessageLink['nick'] + ': ' + lastMessageLink['mensagem'])
                    console.log('Solicitação para reeviar ultima mensagem apagada: ' + lastMessageLink)
                }
                
                command = '!flink youtube on'
                if (message == command) {
                    Config.findOneAndUpdate({channel: 'ninelaris'}, {$set:{filter_link_youtube: true}}, {new: true}, (err, doc) => {console.log(doc)})
                    client.action(channel, 'Filtro de links YouTube: ON')
                    console.log(cyan + `Comando admin solicitado por ${yel + username['display-name']}: ${green + command}` + reset)
                }
                
                command = '!flink youtube off'
                if (message == command) {
                    Config.findOneAndUpdate({channel: 'ninelaris'}, {$set:{filter_link_youtube: false}}, {new: true}, (err, doc) => {console.log(doc)})
                    client.action(channel, 'Filtro de links YouTube: OFF')
                    console.log(cyan + `Comando admin solicitado por ${yel + username['display-name']}: ${green + command}` + reset)
                }
            }

            // COMMON COMMAND

        }




        // NOT COMMAND
        
            // FILTER LINK
            if (message.includes('.') == true || message.includes(',')) {
                if (configs['filter_link'] == true) {
                    if (username['mod'] == mod){
                        for (let url of BlackList.url) {
                            if (message.includes(url) == true ) {                                 
                                if (message.includes(WL[0]) == true || message.includes(WL[1]) == true || message.includes(WL[2]) == true) {
                                    console.log(yel + `@${username['display-name']}`+ reset + cyan + '  Usou link de parceiro: ' + green + `${message}` + reset)
                                
                                } else if (configs['filter_link_youtube'] == true && message.includes('youtube.com') == true || configs['filter_link_youtube'] == true && message.includes('youtu.be') == true) {
                                    lastMessageLink = { nick: username["display-name"],
                                                        mensage: message}
                                    client.deletemessage(channel, `${username['id']}`)
                                    console.log(red + `Mensagem "${message}" de @${username["display-name"]} apagada por conter link` + reset)
                                
                                } else if (configs['filter_link_youtube'] == false && message.includes('youtube.com') == true || configs['filter_link_youtube'] == false && message.includes('youtu.be') == true) {
                                    // do nothing
                                
                                } else {
                                    lastMessageLink = { nick: username["display-name"],
                                                        mensagem: message}
                                    client.deletemessage(channel, `${username['id']}`)
                                    console.log(red + `Mensagem "${message}" de @${username["display-name"]} apagada por conter link` + reset)
                                }   
                            }
                        }                       
                    }
                }
            }





            // BlackList 
            for (let blacklist of BlackList.palavra) {
                if (message.toLowerCase().includes(blacklist) == true) {
                    client.timeout(channel, username['display-name'], 600, 'Frase ofensiva')
                    lastTimeout = username['display-name']    
                    console.log(`${red}Mensagem de ${yel + username['display-name'] + red} apagada por conter FRASE OFENSIVA ("${blacklist}"):  _  ${message}: ` + reset)           
                }
            }
            for (let blacklist of BlackList.frase) {
                if (message.toLowerCase().split(' ').includes(blacklist) == true) {
                    client.timeout(channel, username['display-name'], 600, 'Palavra ofensiva')
                    lastTimeout = username['display-name'] 
                    console.log(`${red}Mensagem de ${yel + username['display-name'] + red} apagada por conter PALAVRA OFENSIVA ("${blacklist}"):  _  ${message}: ` + reset) 
                }
            }



    }
}

module.exports = chat