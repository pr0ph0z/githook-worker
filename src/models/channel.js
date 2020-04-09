const mongoose = require('mongoose')

const channelSchema = new mongoose.Schema({
  id: String,
  name: String
}, {
  versionKey: false
})

const Channel = mongoose.model('Channel', channelSchema)

module.exports = Channel
