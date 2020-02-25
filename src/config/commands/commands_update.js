const mongoose = require('mongoose')
require('../models/config_lists')
require('../models/config_blacklist')
require('../models/config_commands')
require('../models/config_logs')
var config_lists = mongoose.model('config_lists')
var config_blacklist = mongoose.model('config_blacklist')
var config_commands = mongoose.model('config_commands')
var config_logs = mongoose.model('config_logs')


module.exports = Update =  function (client, channel, username, message, user) {

    config_lists.find({channel: channel}).then((List) => {

        // New channel
        newChannel = function () {
            console.log('NewChannel()')
            const newList = {
                channel: channel,
                List_blacklist: [],
                List_commands: [],
                List_nick_logs: []
            }
            
            new config_lists(newList).save().then(() => {
                console.log('Lista criada com sucesso!')
            }).catch(() => { 
                console.log('Falha ao criar nova lista')
            })
        }     
            

        verifyBlacklist = function () {
            List_blacklist = []

            config_blacklist.find({channel: channel}).then((Blacklist) => {

                // VERIFICAR LISTA (BLACKLIST)
                for (let blacklist of Blacklist) {
                    if (blacklist['word'] != null) {
                        List_blacklist.push(blacklist['word'])
                    }
                    if (blacklist['phrase'] != null) {
                        List_blacklist.push(blacklist['phrase'])
                    }
                }
                // ATUALIZAR BLACKLIST
                config_lists.findOneAndUpdate({channel: channel}, {$set:{List_blacklist: List_blacklist}}, {new: true}, (err, doc) => {console.log(err),console.log(doc)})
            })
        }


        verifyCommands = function () {
            List_command = []

            config_commands.find({channel: channel}).then((Commands) => {
                

                // VERIFICAR LISTA (COMMANDS)
                for (let commands of Commands) {
                    List_command.push(commands['name_command'])
                }
                // ATUALIZAR COMMANDS
                config_lists.findOneAndUpdate({channel: channel}, {$set:{List_commands: List_command}}, {new: true}, (err, doc) => {console.log(err),console.log(doc)})
            })
        }



        verifyLogs = function () {
            List_nick_log = []

            config_logs.find({channel: channel}).then((Logs) => {
                
                for (let logs of Logs) {
                    List_nick_log.push(logs['nick'])
                }
                config_lists.findOneAndUpdate({channel: channel}, {$set:{List_nick_logs: List_nick_log}}, {new: true}, (err, doc) => {console.log(err),console.log(doc)})
            })
        }





        if (List[0] == undefined) {
            newChannel()
        }

        verifyBlacklist()
        verifyCommands()  
        verifyLogs() 

        client.say(channel, 'Banco de dados atualizado')

    })
}

