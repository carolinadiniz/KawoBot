const mongoose = require('mongoose')
require('./config/models/config_channels')
var addCommands = require('./config/commands/commands_add')
var Message = require('./config/commands/commands_message')
var blacklist = require('./config/commands/commands_blacklist')
var config_channel = mongoose.model('config_channels')
var commands_update = require('./config/commands/commands_update')


module.exports = chat = function(client, channel, username, message, self) {console.log('new chat()')   
    

    if (self) { return; } else {

        
    // FUNCTIONS
    // USER
    userInfo = function(username) {
        mod = false
        config_channel.find({channel: channel}).then((Channel) => {
            if (Channel[0]['kaworiiAdmin'] == true && username['display-name'] == 'is_Kaworii') {
                mod = true
            }
        
        if (username['mod'] == true) { mod = true }
        try { if (username['badges']['broadcaster'] == '1') { mod = true } }
        catch (e) {}
        user = {
            mod: mod, 
            subscriber: username['subscriber']
        }})
        return user
    }
    user = userInfo(username)



    if (message == 'cls') {
        if (user['mod'] == true) { console.clear() }
    }



    // COMMANDS
    commands = function(client, channel, username, message, user) { console.log('commands (function)')
        // commands Respostas 
        if (message.split(' ')[0].toLowerCase() == '!kcommand') {
            if (user['mod'] == true) { 
                console.log('addCommands.add()')
                addCommands.add(client, channel, username, message, user)
            } else { client.say(channel, `@${username['display-name']}, você não tem permissão para usar este comando`) }
        }

        // commands Setcount
        if (message.split(' ')[0].toLowerCase() == '!ksetcount') {
            if (user['mod'] == true) {
                console.log('addCommands.setcount()')
                addCommands.setcount(client, channel, username, message, user)
            } else { client.say(channel, `@${username['display-name']}, você não tem permissão para usar este comando`) }
        }

        // commands Blacklist
        if (message.split(' ')[0].toLowerCase() == '!blacklist') {
            if (user['mod'] == true) {
                console.log('addCommands.blacklist()')
                addCommands.blacklist(client, channel, username, message, user)
            } else { client.say(channel, `@${username['display-name']}, você não tem permissão para usar este comando`) }
        }

        // commands BOT STATUS
        if (message.toLowerCase() == '!kawobot on') {
            if (user['mod'] == true) {
                config_channel.findOneAndUpdate({channel: channel}, {$set: {bot: true}}, {new: true}, (err, doc) => { console.log(doc)})
                client.action(channel, 'Kawobot: Ativado')
            }
        } else if (message.toLowerCase() == '!kawobot off') {
            if (user['mod'] == true) {
                config_channel.findOneAndUpdate({channel: channel}, {$set: {bot: false}}, {new: true}, (err, doc) => { console.log(doc)})
                client.action(channel, 'Kawobot: Desativado')
            }
        }

        // UPDATE
        if (message.toLowerCase() == '!kawobot update') {
            if (user['mod'] == true) {
                console.log('commands_update()')
                new commands_update(client, channel, username, message, user)
                
            }
        }
    }


    // Commands
    if (message.split(' ')[0][0].includes('!') == true) {
        commands(client, channel, username, message, user)
        Message.read(client, channel, username, message, user)
    }

    // Blacklist
    blacklist.Blacklist(client, channel, username, message, user)

    



    } // self
}