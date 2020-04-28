module.exports = (client, channel, message) => {
   command = message.command
   if (command == 'ping') {
      client.say(channel, `Pong! ${new Date()}`)
   } 

   if (command == 'help') {
      client.say(channel, '[MANUTENÇÃO]')
   }
}