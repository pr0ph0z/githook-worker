const amqp = require('amqplib')
const { amqpUrl } = require('../config')

let channel

const connectToAmqp = async () => {
  const connection = await amqp.connect(amqpUrl)
  channel = await connection.createChannel()

  return channel
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
