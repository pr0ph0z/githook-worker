require('dotenv').config()

const amqpUrl = process.env.NODE_ENV === 'production' ? process.env.AMQP_PROD : process.env.AMQP_DEV
const mongoUrl = process.env.NODE_ENV === 'production' ? process.env.MONGO_PROD : process.env.MONGO_DEV
const mongoOptions = {
  keepAlive: true,
  poolSize: 10,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  user: process.env.MONGO_USERNAME,
  pass: process.env.MONGO_PASSWORD
}

module.exports = {
  amqpUrl,
  mongoUrl,
  mongoOptions
}
