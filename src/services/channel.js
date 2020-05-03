const Channel = require('../models/channel')

const updateChannel = async ({ id, name }) => {
  const channel = await Channel.findOne()
  const query = { id, name }

  if (!channel) {
    await Channel.create(query)
  } else {
    await Channel.updateOne({}, query)
  }
}

const getChannel = async () => {
  const channel = await Channel.findOne()

  return channel
}

module.exports = {
  updateChannel,
  getChannel
}
