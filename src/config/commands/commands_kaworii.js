const mongoose = require('mongoose')
require('../models/config_channels')
require('../models/config_lists')
require('../models/config_logs')
var config_channels = mongoose.model('config_channels')
const config_lists = mongoose.model('config_lists')
var config_logs = mongoose.model('config_logs')


module.exports = commands_kaworii = function (client, channel, username, message, self) {
    
    if (message.toLowerCase().split(' ')[0] == '!kaworiiadmin') {
        
        // STATUS KAWOBOT
        if (message.toLowerCase() == '!kaworiiadmin kawobot on') {
            config_channels.findOneAndUpdate({channel: channel}, {$set: {bot: true}}, {new: true}, (err, doc) => { console.log(doc)})
            client.action(channel, 'Kawobot: Ativado')
        }
        if (message.toLowerCase() == '!kaworiiadmin kawobot off') {
            config_channels.findOneAndUpdate({channel: channel}, {$set: {bot: false}}, {new: true}, (err, doc) => { console.log(doc)})
            client.action(channel, 'Kawobot: Desativado')
        }


        // ADD NEW CHANNEL
        if (message.toLowerCase().includes('!kaworiiadmin new channel') == true) {
            
            const newChannel = {
                nome: message.toLowerCase().split(' ')[3],
                channel: '#'+message.toLowerCase().split(' ')[3]
            }
            new config_channels(newChannel).save().then(() => {
                client.say(channel, 'Novo canal adicionado')
            }).catch(()=> {
                client.say(channel, 'Erro ao adicionar canal')})
        }


        // DELETE CHANNEL
        if (message.toLowerCase().includes('!kaworiiadmin delete channel') == true) {
            config_channels.deleteOne({channel: `#${message.split(' ')[3]}`}, (doc) => {
                console.log(doc)
                client.say(channel, 'Canal apagado')
            })
        }


        // LIST CHANNEL
        if (message.toLowerCase() == '!kaworiiadmin list channels') {
            Channels = []
            config_channels.find().then((channels) => {
                for (let channel of channels) {
                    Channels.push(channel['channel'].substr(1))
                }
            console.log(Channels)
            client.say(channel, `${Channels}`)
            })
        }


        // KAWORII MOD
        if (message.toLowerCase().includes('!kaworiiadmin mod on') == true) {
            config_channels.findOneAndUpdate({channel: channel}, {$set: {kaworiiAdmin: true}}, {new: true}, (err, doc) => { console.log(doc) })
            client.say(channel, 'is_Kaworii is mod')
        }
        if (message.toLowerCase().includes('!kaworiiadmin mod off') == true) {
            config_channels.findOneAndUpdate({channel: channel}, {$set: {kaworiiAdmin: false}}, {new: true}, (err, doc) => { console.log(doc) })
            client.say(channel, "is_Kaworii isn't mod")
        }


        // DELETE LIST
        if (message.toLowerCase().includes('!kaworiiadmin delete list') == true) {
            Channel = ''
            if (message.toLowerCase().split(' ')[3] == undefined){
                Channel = channel
            } else {
                Channel = '#' + message.toLowerCase().split(' ')[3]
            }

            config_lists.deleteOne({channel: Channel}).then(()=>{
                client.say(channel, `Lista ${Channel.substr(1)} deletada do banco de dados`)
            })
        }

        
        // DELETE LOG
        if (message.toLowerCase().includes('!kaworiiadmin delete log') == true) {
            nick_log = message.split(' ')[3]
            if (message.toLowerCase().split(' ')[3] == undefined) {
                client.say(channel, `usuário não informado`)
            } else {
                config_logs.deleteOne({channel: channel, nick: nick_log}).then(()=>{
                    client.say(channel, `Log de usuário deletado`)
                })
            }
        }
    }
}