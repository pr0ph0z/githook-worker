const { mongoUrl, mongoOptions } = require('../config')
const mongoose = require('mongoose')

const createConnection = () => {
  mongoose.connect(mongoUrl, mongoOptions)
}

module.exports = {
  createConnection
}
