const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  github: {
    id: String,
    username: String,
  },
  discord: {
    id: String
  }
}, {
  versionKey: false
})

const User = mongoose.model('User', userSchema)

module.exports = User
