const mongoose = require('mongoose')
require('../commands/commands_add')
require('../models/config_commands')
commands_message = require('../commands/commands_message')
Blacklist = require('../commands/commands_blacklist')
const config_commands = mongoose.model('config_commands')
const config_blacklist = mongoose.model('config_blacklist')


// CHAT FUNCTION
chat = function (client, channel, username, message, self, configs) {
    // DESACTIVE BOT MENSAGE
    if (self) { return; }
    if(message == 'cls') {
        console.clear()
    }

    // BOT ON
    if (configs['bot'] == true) {

        // COMMANDS
        if (message.split(' ')[0][0].includes('!') == true) {
            
            // mod commands
            if (username['mod'] == true || username['badges']['broadcaster'] == 1) {
                
                // add commands
                if (message.split(' ')[0].toLowerCase() == '!kcommand') {
                    console.log('b1 1')
                    new add_commands(client, channel, message)

                }

                if (message.split(' ')[0].toLowerCase() == '!ksetcount') {
                    console.log('b1 2')
                    new setcount(client, channel, message)

                }

                if (message.split(' ')[0].toLowerCase() == '!blacklist') {
                    console.log('b1 3')
                    new commands_blacklist(client, channel, username, message)
                }
                

                console.log('d')
                exclude_commands = false
                for (let exclude of ['!blacklist', '!sr']) {
                    if (message.toLowerCase().split(' ').includes(exclude) == true) {
                        exclude_commands = true
                    }
                }
                if (exclude_commands == false) {
                    new commands_message(client, channel, username, message)
                }



            } else {
            

                // common commands
                console.log('d')
                exclude_commands = false
                for (let exclude of ['!blacklist', '!sr']) {
                    if (message.toLowerCase().split(' ').includes(exclude) == true) {
                        exclude_commands = true
                    }
                }
                if (exclude_commands == false) {
                    new commands_message(client, channel, username, message)
                }
                
            }

            

        }
        
        // NO COMMANDS
        if (username['mod'] != true) {
            new Blacklist(client, channel, username, message)
        }
        if (message.split(' ').includes('BH') == true || message.split(' ').includes('BH?') == true ) {
            client.action(channel, 'BH também conhecido como Texas Brasileiro Keepo ')
        }
        

    }
    
    
}

module.exports = chat
