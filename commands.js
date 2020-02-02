const BlackList = require('./Blacklist')
const BlackList_ = require('./Blacklist_')

// Colors
var red, cyan, yel, green, reset
red = '\033[31m'
cyan = '\033[36m'
yel = '\033[1;33m'
green = '\033[0;32m'
reset = '\033[0m' 

// Variáveis
    // User timed out
    lastTimeout = ''
    // Link filter
    var linkFilter = true
    // Last message link
    var lastMessageLink = ''
    


chat = function(client, channel, username, message, self){
    // IF BOT
    if (self) {
        return;
    }
    // ONLY AMD COMMAND
        // Validando Bot
            var MOD = false
            if (`${username['mod']}` == 'true'){
                MOD = true
            }
  
        // Comandos
        message = message.toLowerCase()
        if (MOD == true){
            // EMOTE ON
            if (message == '!emote on') {
                console.log(cyan + `COMANDO ADMIN SOLICITADO POR ${username['display-name']}: !emote` + reset)
                client.say(channel, '/emoteonly')
            }
            // EMOTE OFF
            if (message == '!emote off') {
                console.log(cyan + `COMANDO ADMIN SOLICITADO POR ${username['display-name']}: !emoteoff` + reset)
                client.say(channel, '/emoteonlyoff')
            } 
            // Link filter switch ON
            if (message == '!flink on') {
                linkFilter = true
                client.action(channel, 'Filtro de links: on')
                console.log(green + `COMANDO ADMIN SOLICITADO POR ${username['display-name']}: LINK FILTER = ${linkFilter}` + reset)
            }
            // Link filter switch OFF
            if (message == '!flink off') {
                linkFilter = false
                client.action(channel, 'Filtro de links: off')
                console.log(red + `COMANDO ADMIN SOLICITADO POR ${username['display-name']}: LINK FILTER = ${linkFilter}` + reset)
            }
            // Say last message link
            if (message == '!link') {
                client.say(channel, lastMessageLink)
                console.log(cyan + `COMANDO ADMIN SOLICITADO POR ${username['display-name']}: LAST MESSAGE LINK: ` + green + `${lastMessageLink}` + reset )
            }
            // UNTIMEOUT
            if (message == '!uto') {
                client.unban(channel, lastTimeout)
                console.log(cyan + `COMANDO ADMIN SOLICITADO POR ${username['display-name']}: UNTIMEOUT ${lastTimeout}: ` + reset )
            }
            // Disconnect
            if (message == '!disconnect kawobot') {
                client.say(channel, 'Kawobot disconnected')
                client.disconnect()
                console.log(red + 'KAWOBOT DISCONNECTED' + reset)
            }
            // Server status
            if (message == '!kawobot status'){
                client.action(channel, 'Kawobot status: Ok')
                console.log(cyan + `COMANDO ADMIN SOLICITADO POR ${username['display-name']}: SERVER STATUS = ON` + reset)
            }
        }
    


    // BlackList
        timeoutTime = 600
        for (let blacklist of BlackList) {
            if (message.toLowerCase().includes(blacklist) == true) {
                client.timeout(channel, username['display-name'], timeoutTime, "Frase ofensiva");
                lastTimeout = username['display-name']
            }
        }
        for (let blacklist of BlackList_) {
            if (message.toLowerCase().split(' ').includes(blacklist) == true) {
                client.timeout(channel, username['display-name'], timeoutTime, "Palavra ofensiva");
                lastTimeout = username['display-name']
            }
        }


    // LINK BLOCKER
        if (linkFilter == true) {
            if(message.includes('.com') == true || message.includes('.tv') == true || message.includes('.org') == true){
                if (message.includes('youtube.com') == true || message.includes('youtu.be') == true || message.includes('.tv/ninelaris') == true){
                    //client.deletemessage(channel, `${username['id']}`)
                    lastMessageLink = `@${username['display-name']}` + ' disse: ' + message
                } else {
                    client.deletemessage(channel, `${username['id']}`)
                    lastMessageLink = `@${username['display-name']}` + ' disse: ' + message
                }
            }
        }


    // ANYONE
        if (message == '!mod?') {
            client.say(channel, `${MOD}`)
        }
        if (message == '!kawobot'){
            client.action(channel, 'KawoBot é um Chat bot em desenvolvimento. Criado por @is_Kaworii com o objetivo de suprir necessidades específicas deste canal')
        }
        if (message == '!kcommands') {
            client.action(channel, 'MOD {!emote on [Emote only]  -  !emote off [Emote only off]  -  !flink on [Link filter ON]  -  !flink off [Link filter OFF]  -  !link [retorna última mensagem apagada por conter link]  -  !uto [remove último timeout (só funciona com kawobot)]} |||| ANY {!kcommands, !kawobot}')
        }

    
}
module.exports = chat