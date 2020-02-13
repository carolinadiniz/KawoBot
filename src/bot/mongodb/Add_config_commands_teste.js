const mongoose = require('mongoose')
require('./config_commands')
const config_commands = mongoose.model('config_commands')


mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/kawobotdb', {useNewUrlParser: true, useUnifiedTopology: true})

channel = 'is_kaworii'
message = '!command add !amor Há [_PERCENT_] de <3 entre [_USER_] e [_TOUSER_]'

console.clear()
console.log('MESSAGEM:  ' + message)
console.log(message.split(' ')[2])

if (message.split(' ')[0] == '!command') {

    // ADD
    if (message.split(' ')[1] == 'add') {
        permission = 'common'
        type = 'say'
        if (message.includes('[_USER_]') == true || message.includes('[_TOUSER_]') == true) {
            includes = true
        } else {
            includes = false
        } 
    }


    // MOD
    if (message.split(' ')[1] == 'mod') {
        console.log('MOD')
    }


    // DELETE
    if (message.split(' ')[1] == 'delete') {
        console.log('delete')
    }
}




const newCommnad = {
    permission: permission,
    channel: channel,
    type: type,
    includes: includes,
    name_command: message.split(' ')[2],
    Message: message
}

new config_commands(newCommnad).save().then(() => {
    console.log('Schema criado com sucesso!')
}).catch((err) => {
    console.log('Falha ao criar Schema!')
})