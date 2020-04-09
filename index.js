require('dotenv').config()
const { Client } = require('discord.js')
const amqp = require('./src/message_brokers/amqp')
const mongo = require('./src/databases/mongo')
const logger = require('./src/utils/logger')
const github = require('./src/services/github')
const user = require('./src/services/user')
const channel = require('./src/services/channel')

const client = new Client()

amqp.connectToAmqp()
  .then(channel => {
    logger.info('AMQP connected!')
    return channel
  })
  .then(channel => {
    logger.info('Consuming...')
    channel.consume('hooks', async msg => {
      client.emit('hooks', msg)
    })
  })

mongo.createConnection()

client.on('ready', () => {
  logger.info('Discord bot is ready!')
})

client.on('message', async message => {
  if (message.content.startsWith('/assign')) {
    const [commands] = [...'/assign pr0ph0z <@!414577521263247367>'.matchAll(/(\/assign)\s(.*)\s<@!(.*)>/g)]
    if (commands.length === 4) {
      const [,, githubUsername, discordId] = commands
      const githubUser = await github.getUserIdByUsername(githubUsername)
      if (githubUser !== 'Not Found') {
        const payload = {
          github: {
            id: githubUser,
            username: githubUsername
          },
          discord: {
            id: discordId
          }
        }
        await user.updateUser(payload)
        message.channel.send('User assigned!')
      }
    } else {
      message.channel.send('Unrecognized command')
    }
  } else if (message.content.startsWith('/upchan')) {
    const { id, name } = message.channel
    await channel.updateChannel({ id, name })
    message.channel.send('Main channel updated')
  }
})

client.login(process.env.CLIENT_SECRET)
