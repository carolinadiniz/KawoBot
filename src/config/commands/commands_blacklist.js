const mongoose = require('mongoose')
require('../models/config_blacklist')
require('../models/config_logs')
const config_log = mongoose.model('config_logs')
const config_blacklist = mongoose.model('config_blacklist')


cBlacklist = function(client, channel, username, message) {
    message = 'a'
    config_blacklist.find({channel: channel}).then((Blacklist) => {
        for (let blacklist of Blacklist) {
            console.log('------------------>>> -1  Comparando mesagem com Blacklist Phrase')
            
            if (message.toLowerCase().includes(blacklist['phrase']) == true) {
                console.log('------------------->>> 0  | Blacklist: phrase')
                
                config_log.find({channel: channel}).then((Logs) => {
                    // SE NÃO TEM LOG AINDA
                    if (Logs[0] == undefined) {
                        console.log('------------------->>> 1')
                        const newLog = {
                            channel: channel,
                            nick: `${username['display-name']}`,
                            Message: message + ` (${blacklist['punishment']})(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()})`,
                            punishment: blacklist['punishment'],
                            points: 100 - blacklist['points'],
                            date: Date()
                        }
                        
                        new config_log(newLog).save().then((doc) => {
                            console.log(doc)
                        }).catch(() => {
                            console.log('Falha ao adicionar novo usuário ao log')
                        })
                    }
                         
                    
                    for (let logs of Logs) {
                        console.log('------------------->>> 2')
                        if (username['display-name'] == logs['nick']) {
                            console.log('------------------->>> 2.1')
                            config_log.findOneAndUpdate({nick: username['display-name']},{$set: {
                                Message: `${logs['Message']} | ${message + ` (${blacklist['punishment']})(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()})`}`, 
                                punishment: `${logs['punishment']}, ${blacklist['punishment']}`,
                                date: new Date(),
                                points: parseInt(logs['points']) - parseInt(blacklist['points'])
                            }}, {new: true}, (err, doc) => { console.log(doc) })

                            
                        } else {
                            console.log('------------------->>> 2.2')
                            const newLog = {
                                channel: channel,
                                nick: `${username['display-name']}`,
                                Message: message + ` (${blacklist['punishment']})(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()})`,
                                punishment: blacklist['punishment'],
                                points: 100 - blacklist['points'],
                                date: Date()
                            }
                            
                            new config_log(newLog).save().then((doc) => {
                                console.log(doc)
                            }).catch(() => {
                                console.log('Falha ao adicionar novo usuário ao log')
                            })
                        }
                    }
                    
                    console.log('------------------->>> 3 ')
                    if (blacklist['punishment'] == 'delete') {
                        console.log('------------------->>> 3 1  | Deleta mensagem')
                        client.deletemessage(channel, username['id'])
                    }
                    if (blacklist['punishment'] == 'ban') {
                        console.log('------------------->>> 3 2')
                        client.ban(channel, username['display-name'], 'banido pela utilização de frase extremamente ofensiva')
                    }
                    if (blacklist['punishment'] != 'ban' && blacklist['punishment'] != 'delete') {
                        console.log('------------------->>> 3 3')
                        punishment = parseInt(blacklist['punishment'])
                        client.timeout(channel, username['display-name'], punishment,'timeouted por usar frase ofensiva')
                    }
                    /*if (blacklist['points'] <= 0) {
                        console.log('------------------->>> 3 4')
                        config_log.findOneAndUpdate({nick: username['display-name']},{$set: {
                            Message: `${logs['Message']} | ${message + ` (${blacklist['punishment']})(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()})`}`, 
                            punishment: `${logs['punishment']}, ${blacklist['punishment']}`,
                            date: new Date(),
                            points: parseInt(logs['points']) - parseInt(blacklist['points'])
                        }}, {new: true}, (err, doc) => { console.log(doc) })

                        client.ban(channel, username['display-name'], 'banido por histórico ruim no canal')

                    }*/
                })
            }
            
            // =========================================================================================================================================================================
            console.log('------------------->>> 4  Comparando mesagem com Blacklist word')
            
            if (message.toLowerCase().split(' ').includes(blacklist['word']) == true) {
                console.log('------------------->>> 5  | Blacklist: word')
                config_log.find({channel: channel}).then((Logs) => {
                    console.log('------------------->>> 6')
                    if (Logs[0] == undefined) {
                        console.log('------------------->>> 7  | Cria um novo log')
                        const newLog = {
                            channel: channel,
                            nick: `${username['display-name']}`,
                            Message: message + ` (${blacklist['punishment']})(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()})`,
                            punishment: blacklist['punishment'],
                            points: 100 - parseInt(blacklist['points']),
                            date: Date()
                        }
                        
                        new config_log(newLog).save().then((doc) => {
                            console.log(doc)
                        }).catch(() => {
                            console.log('Falha ao adicionar novo usuário ao log')
                        })
                    }
                                        
                    for (let logs of Logs) {
                        console.log('------------------->>> 8')
                        if (username['display-name'] == logs['nick']) {
                            config_log.findOneAndUpdate({nick: username['display-name']},{$set: {
                                Message: `${logs['Message']} | ${message + ` (${blacklist['punishment']})(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()})`}`, 
                                punishment: `${logs['punishment']}, ${blacklist['punishment']}`,
                                date: new Date()
                            }}, {new: true}, (err, doc) => { console.log(doc) })

                            
                        } else {
                            console.log('------------------->>> 9')
                            const newLog = {
                                channel: channel,
                                nick: `${username['display-name']}`,
                                Message: message + ` (${blacklist['punishment']})(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()})`,
                                punishment: blacklist['punishment'],
                                points: 100 - blacklist['points'],
                                date: Date()
                            }
                            
                            new config_log(newLog).save().then((doc) => {
                                console.log(doc)
                            }).catch(() => {
                                console.log('Falha ao adicionar novo usuário ao log')
                            })
                        } 
                    }
                    console.log('------------------->>> 10  | Ações do chat')
                    
                    if (blacklist['punishment'] == 'none') {
                        console.log('------------------->>> 11  | Mensagem Vista')

                    } else if (blacklist['punishment'] == 'delete') {
                        console.log('------------------->>> 11  | Deleta mensagem')
                        client.deletemessage(channel, username['id'])

                    } else if (blacklist['punishment'] == 'ban') {
                        console.log('------------------->>> 12')
                        client.ban(channel, username['display-name'], 'banido por usar palavra extremamente ofensiva')

                    } else if (blacklist['punishment'] != 'ban' && blacklist['punishment'] != 'delete') {
                        console.log('------------------->>> 13')
                        punishment = parseInt(blacklist['punishment'])
                        client.timeout(channel, username['display-name'], punishment,'timeouted por usar palavra ofensiva')
                    }

                    /**if (blacklist['points'] == 2) {
                        console.log('------------------->>> 14  | Verifica se está com menos de 0 pontos')
                        config_log.findOneAndUpdate({nick: username['display-name']},{$set: {
                            Message: `${Logs['Message']} | ${message + ` (${blacklist['punishment']})(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()})`}`, 
                            punishment: `${Logs['punishment']}, ${blacklist['punishment']}`,
                            date: new Date(),
                            points: parseInt(Logs['points']) - parseInt(blacklist['points'])
                        }}, {new: true}, (err, doc) => { console.log(doc) })

                        client.ban(channel, username['display-name'], 'banido por histórico ruim no canal')
                    }*/
                })
            }
        }
    })
}

module.exports = cBlacklist