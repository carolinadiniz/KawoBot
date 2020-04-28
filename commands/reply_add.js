const fs = require('fs')

module.exports = (client, channel, message) => {
   if (message.content.split(/ +/g)[1] == undefined) return client.say(channel, 'Erro de sintaxe: "!kcommand add/delete [nome] [mensagem]".')
   if (message.content.split(/ +/g)[1] !== "add" && message.content.split(/ +/g)[1] !== "delete") return client.say(channel, 'Erro de sintaxe: "!kcommand add/delete [nome] [mensagem]".')
   if (!message.content.split(/ +/g)[3]) return client.say(channel, 'Erro de sintaxe: "!kcommand add/delete [nome] [mensagem]".')


   function load(file) {
      const fileBuffer = fs.readFileSync(file, 'utf-8')
      return JSON.parse(fileBuffer)
   }
   function save(content, file) {
      const contentString = JSON.stringify(content)
      return fs.writeFileSync(file, contentString)
   }

   
   const command = message.content.split(/ +/g)[2]

   const message_content = message.content.slice(message.content.split(/ +/g)[0].length + 1 + message.content.split(/ +/g)[1].length + 1 + message.content.split(/ +/g)[2].length + 1).trim()
   console.log(message_content)
   

   // ADD
   if (message.content.split(/ +/g)[1] === "add") {
      
      if (message.commands.includes(message.content.split(/ +/g)[2])) {
         let commands = load('./json/reply.json')
         delete commands[channel][command]
         commands[channel][command] = { message_content: message_content }
         save(commands, './json/reply.json')
         client.say(channel, `Comando atualizado!`)  
      } else {
         let commands = load('./json/reply.json')
         commands[channel][command] = { message_content: message_content }
         save(commands, './json/reply.json')
         client.say(channel, `Comando adicionado!`)  
      }
   }

   // DELETE
   if (message.content.split(/ +/g)[1] === "delete") {
      
      if (message.commands.includes(message.content.split(/ +/g)[2])) {
         let commands = load('./json/reply.json')
         delete commands[channel][command]
         save(commands, './json/reply.json')
         client.say(channel, `Comando deletado!`)  
      } else {
         client.say(channel, `Comando deletado!`)         
      }
   }
}