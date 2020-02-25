const mongoose = require('mongoose')
require('../models/config_blacklist')
require('../models/config_lists')
require('../models/config_logs')
const config_blacklist = mongoose.model('config_blacklist')
var config_lists = mongoose.model('config_lists')
var config_logs = mongoose.model('config_logs')

module.exports = {
    Blacklist: (client, channel, username, message, user) => {
        if (user['mod'] == false) {
        config_lists.find({channel: channel}).then((List) => {

            // SEPARAÇÃO DE BLACKLIST
            Word = []
            Phrase = []

            for (let blacklist of List[0]['List_blacklist']) {
                if (blacklist.split(' ')[1] == undefined) {
                    Word.push(blacklist)
                } else {
                    Phrase.push(blacklist)
                }
            }
            



            // BLACKLIST
            LOG = function (word, phrase) {
                
                // LOGS 
                // SE NÃO ESTIVER NA LISTA
                if (List[0]['List_nick_logs'] == undefined) {
                    if (word != null) {
                        config_blacklist.find({channel: channel, word: word}).then((Blacklist) => {
    
                            const newLog = {
                                channel: channel,
                                nick: username['display-name'],
                                Message: message + ` (${Blacklist[0]['word']})( ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()} )`,
                                punishment: Blacklist[0]['punishment'],
                                points: 100 - Blacklist[0]['points'],
                                date: Date()
                            }

                            new config_logs(newLog).save().then((doc) => {
                                console.log(doc)
                            }).catch(() => {
                                console.log('Falha ao adicionar novo usuário ao log')
                            })
                        })
                    }

                    if (phrase != null) {
                        config_blacklist.find({channel: channel, phrase: phrase}).then((Blacklist) => {
    
                            const newLog = {
                                channel: channel,
                                nick: username['display-name'],
                                Message: message + ` (${Blacklist[0]['phrase']})( ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()} )`,
                                punishment: Blacklist[0]['punishment'],
                                points: 100 - Blacklist[0]['points'],
                                date: Date()
                            }

                            new config_logs(newLog).save().then((doc) => {
                                console.log(doc)
                            }).catch(() => {
                                console.log('Falha ao adicionar novo usuário ao log')
                            })
                        })
                    }
                } else


                // ATUALIZAR USUÁRIO
                if (List[0]['List_nick_logs'].includes(username['display-name']) == true) {
                    console.log('Atualizar usuário existente')

                    
                    if (word != null) {
                        config_blacklist.find({channel: channel, word: word}).then((Blacklist) => {

                            config_logs.find({channel: channel, nick: username['display-name']}).then((Logs) => {

                                config_logs.findOneAndUpdate({channel: channel, nick: username['display-name']}, {$set: {
                                    Message: `${Logs[0]['Message']} | ${message + ` (${Blacklist[0]['punishment']})( ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()} )`}`,
                                    punishment: `${Logs[0]['punishment']}, ${Blacklist[0]['punishment']}`
                                }}, {new: true}, (err, doc) => { console.log(doc) })
                            })
                        })
                    }


                    if (phrase != null) {
                        config_blacklist.find({channel: channel, phrase: phrase}).then((Blacklist) => {

                            config_logs.find({channel: channel, nick: username['display-name']}).then((Logs) => {

                                config_logs.findOneAndUpdate({channel: channel, nick: username['display-name']}, {$set: {
                                    Message: `${Logs[0]['Message']} | ${message + ` (${Blacklist[0]['punishment']})( ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()} )`}`,
                                    punishment: `${Logs[0]['punishment']}, ${Blacklist[0]['punishment']}`
                                }}, {new: true}, (err, doc) => { console.log(doc) })
                            })
                        })
                    }
                }
                

                // CRIAR NOVO USUÁRIO
                else {
                    console.log('Criar novo usuário')

                    if (word != null) {
                        config_blacklist.find({channel: channel, word: word}).then((Blacklist) => {
    
                            const newLog = {
                                channel: channel,
                                nick: username['display-name'],
                                Message: message + ` (${Blacklist[0]['word']})( ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()} )`,
                                punishment: Blacklist[0]['punishment'],
                                points: 100 - Blacklist[0]['points'],
                                date: Date()
                            }

                            new config_logs(newLog).save().then((doc) => {
                                console.log(doc)
                            }).catch(() => {
                                console.log('Falha ao adicionar novo usuário ao log')
                            })
                        })
                    }


                    if (phrase != null) {
                        config_blacklist.find({channel: channel, phrase: phrase}).then((Blacklist) => {
                      
                            const newLog = {
                                channel: channel,
                                nick: username['display-name'],
                                Message: message + ` (${Blacklist[0]['phrase']})( ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()} )`,
                                punishment: Blacklist[0]['punishment'],
                                points: 100 - Blacklist[0]['points'],
                                date: Date()
                            }

                            new config_logs(newLog).save().then((doc) => {
                                console.log(doc)
                            }).catch(() => {
                                console.log('Falha ao adicionar novo usuário ao log')
                            })
                        })
                    }
                    List_nick_logs = List[0]['List_nick_logs']
                    List_nick_logs.push(username['display-name'])
                    config_lists.findOneAndUpdate({channel: channel}, {$set:{List_nick_logs: List_nick_logs}}, {new: true}, (err, doc) => {console.log(err),console.log(doc)})
                }
            }



            Punishment = function (word, phrase) {
                if (word != null) {
                    config_blacklist.find({channel: channel, word: word}).then((Blacklist) => {
                        console.log(Blacklist[0]['punishment'])
                        if (Blacklist[0]['punishment'] == 'none') {
                            console.log('Punishment: None')
                        
                        } else if (Blacklist[0]['punishment'] == 'delete') {
                            console.log('Punishment: Delete')
                            client.deletemessage(channel, username['id'])

                        } else if (Blacklist[0]['punishment'] == 'ban') {
                            console.log('Punishment: BAN!')
                            client.ban(channel, username['display-name'], 'banido por usar palavra extremamente ofensiva')

                        } else if (Blacklist[0]['punishment'] != 'ban' && Blacklist[0]['punishment'] != 'delete' && Blacklist[0]['punishment'] != 'none') {
                            console.log('Punishment: Timeout')
                            punishment = parseInt(Blacklist[0]['punishment'])
                            client.timeout(channel, username['display-name'], punishment,'timeouted por usar palavra ofensiva')
                        }
                    })
                }

                if (phrase != null) {
                    config_blacklist.find({channel: channel, phrase: phrase}).then((Blacklist) => {
                        console.log(Blacklist[0]['punishment'])
                        if (Blacklist[0]['punishment'] == 'none') {
                            console.log('Punishment: None')
                        
                        } else if (Blacklist[0]['punishment'] == 'delete') {
                            console.log('Punishment: Delete')
                            client.deletemessage(channel, username['id'])

                        } else if (Blacklist[0]['punishment'] == 'ban') {
                            console.log('Punishment: BAN!')
                            client.ban(channel, username['display-name'], 'banido por usar palavra extremamente ofensiva')

                        } else if (Blacklist[0]['punishment'] != 'ban' && Blacklist[0]['punishment'] != 'delete' && Blacklist[0]['punishment'] != 'none') {
                            console.log('Punishment: Timeout')
                            punishment = parseInt(Blacklist[0]['punishment'])
                            client.timeout(channel, username['display-name'], punishment,'timeouted por usar palavra ofensiva')
                        }
                    })
                }
            }






            // MESSAGEM
            for (let word of Word) {
                if (message.toLowerCase().split(' ').includes(word) == true) {
                    console.log('PALAVRA OFENSIVA')
                    LOG(word, null)
                    Punishment(word, null)
                }
            }
            
            for (let phrase of Phrase) {
                if (message.toLowerCase().includes(phrase) == true) {
                    console.log('FRASE OFENSIVA')
                    LOG(null, phrase)
                    Punishment(null, phrase)
                }
            }

            
        })
        }
    }
}