const config = require('./config/config')
const Default = require('./commands/default') 
const Reply = require('./commands/reply')
const Reply_add = require('./commands/reply_add')
const tmi = require('tmi.js')
const fs = require('fs')
const client = new tmi.Client(config)
const configChannel = require('./json/channels.json')
const contentReply = './json/reply.json'


client.connect()

client.on('message', (channel, user, content, self) => {
   if (self) return

   let message = {
      prefix: configChannel[channel].prefix,
      user:  user,
      content: content
   }

   // DIF
   function load(content) {
      const fileBuffer = fs.readFileSync(content, 'utf-8')
      const contentJson = JSON.parse(fileBuffer)
      return contentJson
   }



   // Se o bot estiver desativado no canal
   if (!configChannel[channel].status) return

   // Commands
   if (content.startsWith(configChannel[channel].prefix)) {
      message['command'] = content.slice(message.prefix.length).trim().split(/ +/g).shift().toLowerCase()

      Default(client, channel, message)

      if (Object.keys(load(contentReply)[channel]).includes(message.command)) {
         Reply(client, channel, message)
      }

      if (message.command == 'kcommand') {
         message['commands'] = Object.keys(load(contentReply)[channel])
         Reply_add(client, channel, message)
      }

   }
})
