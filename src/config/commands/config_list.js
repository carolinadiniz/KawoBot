const mongoose = require('mongoose')
require('../models/config_logs')
require('../models/config_commands')
require('../models/config_blacklist')
require('../models/config_lists')
const config_commands = mongoose.model('config_commands')
const config_blacklist = mongoose.model('config_blacklist')
const config_logs = mongoose.model('config_logs')
const config_lists = mongoose.model('config_lists')


mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/kawobotdb', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('\033[0;32m[\033[0;36m'+'Mongodb \033[0;32m Conectado com Sucesso]'+'\033[0m')
}).catch((err)=>{
    console.log('\033[0;31m[\033[0;36m'+'\033[0;31mFalha ao se conectar ao MongoDB]'+'\033[0m')
})




channel = '#ninelaris'
message = ' sua puta do caralho '


info = function (channel, message) {
    List_blacklist = []
    
    config_lists.find().then((Lists) => {

        // NEW CHANNEL
        newChannel = function (channel) {
            console.log("newchannel")
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




        // VERIFY BLACKLIST
        verifyBlacklist = function (channel) {
            console.log('verifyBlacklist') 
            config_lists.find({channel: channel}).then((list_blacklist)=>{
                List_blacklist = list_blacklist[0]['List_blacklist']

                config_blacklist.find({channel: channel}).then((Blacklist) => {
                    let newList = false
                

                    // VERIFICAR LISTAS (BLACKLIST)
                    for (let blacklist of Blacklist) {
                        function atualizarList_blacklist(List_blacklist, word, phrase) {
                            if (List_blacklist.indexOf(word) === -1){
                                if (word != null) {
                                    List_blacklist.push(word)
                                    newList = true
                                }
                                
                            }
                            if (List_blacklist.includes(`${phrase}`) == false){
                                if (phrase != null) {
                                    List_blacklist.push(phrase)
                                    newList = true
                                }
                                
                            }
                        }
                        
                        atualizarList_blacklist(List_blacklist, blacklist['word'], blacklist['phrase'])
                    }
                    
                    
                    // 
                    if (newList == true) {
                        config_lists.findOneAndUpdate({channel: channel}, {$set:{List_blacklist: List_blacklist}}, {new: true}, (err, doc) => {console.log(err),console.log(doc)})
                    }
                })
            })
        }




        // VERIFY COMMANDS
        verifyCommands = function (channel) {
            console.log('verifyCommands') 
            config_lists.find({channel: channel}).then((list_commands)=>{
                List_commands = list_commands[0]['List_commands']

                config_commands.find({channel: channel}).then((Commands) => {
                    let newList = false
                    let NewList_commands = []
                    
                    console.log(Commands)


                    for (let commands of Commands) {
                        function atualizarList_commands (List_commands, commands) {
                            NewList_commands.push(commands)
                            if (List_commands.indexOf(commands) === -1) {
                                List_commands.push(commands)
                                newList = true
                            }
                        }
                        atualizarList_commands(List_commands, commands['name_command'])
                    }

                    console.log(NewList_commands)

                    if (newList == true) {
                        config_lists.findOneAndUpdate({channel: channel}, {$set:{List_commands: List_commands}}, {new: true}, (err, doc) => {console.log(err),console.log(doc)})
                    
                    }
                    
                })
            })
        }











        
        // VERIFICAR SE EXISTE LISTA DO CANAL
        let Onechannel = false
        for (let onechannel of Lists) {
            if (onechannel['channel'].indexOf(channel) === 0) {
                Onechannel = true
            }
        }
        if (Onechannel != true) {
            newChannel(channel)
        }

        // VERIFICAR SE LISTAS ESTÃO IGUAIS
        verifyBlacklist(channel)
        verifyCommands(channel)


        
        





















        /*
        // BLACKLIST
        */
        
    })

    console.log('FIM')
}
info(channel)