const fs = require('fs')

module.exports = (client, channel, message) => {

   // DIF
   function load(file) {
      const fileBuffer = fs.readFileSync(file, 'utf-8')
      return JSON.parse(fileBuffer)
   }

   message_content = load('./json/reply.json')[channel][message.command].message_content

   let target = null
   for (let palavra of message.content.split(/ +/g)) {
      if (palavra.includes('@')) {target = palavra; break}
   }
   if (target == null) target = message.content.slice(message.prefix.length + message.command.length).trim()
   

   // Tratando a mensagem
   message_content = message_content.replace('{user.name}', `@${message.user.username}`).replace('{target.name}', `${target}`)

   client.say(channel, message_content)
}