const amqp = require('amqplib')
const { amqpUrl } = require('../config')
const logger = require('../utils/logger')

let channel

const connectToAmqp = async () => {
  try {
    const connection = await amqp.connect(amqpUrl)
    channel = await connection.createChannel()
    return channel
  } catch (error) {
    logger.error(error)
  }
}

const getChannel = () => channel

const publish = (message) => {
  getChannel().publish('', 'hooks', message)
}

module.exports = {
  connectToAmqp,
  getChannel,
  publish
}
