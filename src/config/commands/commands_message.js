const mongoose = require('mongoose')
require('../models/config_commands')
const config_commands = mongoose.model('config_commands')

module.exports = commands_message = function (client, channel, username, message) {
    console.log('c2')
    config_commands.find().then((cmds) => {
        console.log('c3')
        for (let cmd of cmds) {
            // CHANNEL
            if (cmd['channel'] == channel) {
                console.log('c4')

                if (message.toLowerCase().split(' ')[0].substr(1) == cmd['name_command']) {
                    
                
                    console.log('c5')

                    // ALL COMMANDS
                    allcommands = ''
                    for (let cmd of cmds) {if (cmd['permission'] == 'common' && cmd['channel'] == channel) {allcommands = allcommands + (cmd['name_command']) + ', '}}
                    
                    // Mensagem pura
                    Message = cmd['Message'].replace(cmd['Message'].split(' ')[0], '').replace(cmd['Message'].split(' ')[1], '').replace(cmd['Message'].split(' ')[2], '').replace(/^\s*/, '')
                    if (Message.includes('(_USER_)') == true)       {Message = Message.replace('(_USER_)', `${username['display-name']}`), console.log('c6')}
                    if (Message.includes('(_PERCENT_)') == true)    {Message = Message.replace('(_PERCENT_)', `${Math.ceil(Math.random(0, 101) * 100)}%`), console.log('c7')}
                    if (Message.includes('(_TOUSER_)') == true)     {Message = Message.replace('(_TOUSER_)', `${message.replace(message.split(' ')[0], '').replace(/^\s*/, '')}`), console.log('c8')}
                    if (Message.includes('(_COMMANDS_)') == true)   {Message = Message.replace('(_COMMANDS_)', `${allcommands}`), console.log('c9')}
                    if (Message.includes('(_COUNT_)') == true || message.split(' ').includes(cmd['channel']))      {config_commands.findOneAndUpdate({name_command: `${cmd['name_command']}`}, {$set:{count: cmd['count'] + 1}}, {new: true}, (err, doc) => { console.log('c10')})
                                                                    Message = Message.replace('(_COUNT_)', `${cmd['count'] + 1}`), console.log('c11')}
                    
                    console.log('c12')
                    // MOD COMMANDS
                    console.log(Message)
                    if (cmd['permission'] == 'mod' && username['mod'] == true || cmd['permission'] == 'mod' && username['badges']['broadcaster'] == 1) {
                        console.log('c13')
                        if (message.toLowerCase().split(' ')[0].substr(1) == cmd['name_command']) {
                            console.log('c14')
                            client.say(channel, Message.replace('kcommands,', ''))
                        }
                    } else

                    // COMMON COMMANDS
                    if (cmd['permission'] == 'common') {
                        console.log('c15')
                        // Kawobot commands
                        if (message.toLowerCase().split(' ')[0].substr(1) == cmd['name_command']) {
                            console.log('c16')
                            client.say(channel, Message.replace('kcommands,', ''))
                        }                         
                    }
                }
            }

        }
        if (message.toLowerCase() == '!song list') {
            client.action(channel, `@${username['display-name']} -> A lista de músicas para este canal é acessível por nightbot.tv/t/ninelaris/song_requests`)
        }
        if (message.toLowerCase() == '!princesa do campo') {
            client.action(channel, 'BCWarrior Princesa do Campo! MercyWing1 Keepo MercyWing2 ')
        }
        if (channel == 'is_kaworii' && message.toLowerCase().split().includes('priestbot') == true) {
            client.action(channel, 'PriestBot é bobo -__-!')
        }
    })
}