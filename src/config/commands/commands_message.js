const mongoose = require('mongoose')
require('../models/config_lists')
require('../models/config_commands')
var config_lists = mongoose.model('config_lists')
var config_commands = mongoose.model('config_commands')

module.exports = {
    read: (client, channel, username, message, user) => {
        slmessage = message.toLowerCase().split(' ')
        config_lists.find({channel: channel}).then((List) => {
            List_commands = List[0]['List_commands']

            // Se mensagem == commandos
            if (List_commands.includes(slmessage[0].substr(1)) == true) {

                config_commands.find({channel: channel}).then((Command) => {
                    const command = Command.find( obj => obj.name_command === slmessage[0].substr(1))
                    
                    // ALL COMMANDS
                    allCommands = function () {
                        let List = ''
                        for (let command of Command) {
                            if (command['name_command'] != 'kcommands'){
                                if (command['name_command'] != 'clear') {
                                    List = command['name_command'] + ', ' + List 
                                }
                            }
                        }
                        return List
                    }
                    
                    
                    
                    Message = command['Message'].replace(command['Message'].split(' ')[0], '').replace(command['Message'].split(' ')[1], '').replace(command['Message'].split(' ')[2], '').replace(/^\s*/, '')
                    if (Message.includes('(_USER_)') == true)       {Message = Message.replace('(_USER_)', `${username['display-name']}`)}
                    if (Message.includes('(_PERCENT_)') == true)    {Message = Message.replace('(_PERCENT_)', `${Math.ceil(Math.random(0, 101) * 100)}%`)}
                    if (Message.includes('(_RANDOM_)') == true)     {Message = Message.replace('(_RANDOM_)', `${Math.ceil(Math.random(0, 101) * 100)}`)}
                    if (Message.includes('(_TOUSER_)') == true)     {Message = Message.replace('(_TOUSER_)', `${message.replace(message.split(' ')[0], '').replace(/^\s*/, '')}`)}
                    if (Message.includes('(_COMMANDS_)') == true)   {Message = Message.replace('(_COMMANDS_)', `${allCommands()}`)}
                    if (Message.includes('(_COUNT_)') == true)      {config_commands.findOneAndUpdate({name_command: `${command['name_command']}`}, {$set:{count: command['count'] + 1}}, {new: true}, (err, doc) => { console.log(doc)})
                                                                        Message = Message.replace('(_COUNT_)', `${command['count'] + 1}`)}
                    

                    // ADM COMMAND
                    if (command['permission'] == 'mod' && user['mod'] == true) {
                        if (slmessage[0].substr(1) == command['name_command']) {
                            client.say(channel, Message)
                        }
                    } else

                    // COMMON COMMAND
                    if (command['permission'] == 'common') {
                        if (slmessage[0].substr(1) == command['name_command']) {
                            client.say(channel, Message)
                        }
                    }
                })
            }
        })
    }
}