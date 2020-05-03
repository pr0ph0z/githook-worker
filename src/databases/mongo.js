const { mongoUrl, mongoOptions } = require('../config')
const mongoose = require('mongoose')

const createConnection = async () => {
  await mongoose.connect(mongoUrl, mongoOptions)
}

module.exports = {
  createConnection
}
