require('dotenv').config()
const { Client } = require('discord.js')
const amqp = require('./src/message_brokers/amqp')
const logger = require('./src/utils/logger')

amqp.connectToAmqp().then(_ => logger.info('AMQP connected!'))
amqp.getChannel().consume(async msg => {
  //
})

const client = new Client()

client.on('ready', () => {
  logger.info('Discord bot is ready!')
})

client.on('message', message => {
  //
})
