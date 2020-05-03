require('dotenv').config()
const { Client } = require('discord.js')
const amqp = require('./src/message_brokers/amqp')
const mongo = require('./src/databases/mongo')
const logger = require('./src/utils/logger')
const github = require('./src/services/github')
const user = require('./src/services/user')
const channel = require('./src/services/channel')
const { parseMessage } = require('./src/services/parse')

const client = new Client()

mongo.createConnection()

client.on('ready', () => {
  logger.info('Discord bot is ready!')
  amqp.connectToAmqp()
    .then(channel => {
      logger.info('AMQP connected!')
      return channel
    })
    .then(channel => {
      logger.info('Consuming...')
      channel.consume('hooks', async msg => {
        const messages = await parseMessage(msg.content.toString())

        if (messages.server !== undefined) {
          client.channels.cache.get(messages.server.id).send(messages.server.message)
        }
        if (messages.direct_message !== undefined) {
          const user = await client.users.fetch(messages.direct_message.id)
          const dm = await user.createDM()
          await dm.send(messages.direct_message.message)
        }
        if (messages.direct_messages !== undefined) {
          for (const directMessage of messages.direct_messages) {
            const user = await client.users.fetch(directMessage.id)
            const dm = await user.createDM()
            await dm.send(directMessage.message)
          }
        }

        channel.ack(msg)
      })
    })
    .catch(error => logger.error(error))
})

client.on('message', async message => {
  try {
    if (message.content.startsWith('/assign')) {
      const [commands] = [...message.content.matchAll(/(\/assign)\s(.*)\s(.*)/g)]
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
              id: discordId.replace(/[<@!>]/g, '')
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
  } catch (error) {
    logger.error(error)
  }
})

client.login(process.env.CLIENT_SECRET)
  .then(discordClientSecret => logger.info('Discord bot is logged in!'))
  .catch(error => logger.error(error))
