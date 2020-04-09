const Channel = require('../models/channel')
const logger = require('../utils/logger')

const updateChannel = async ({ id, name }) => {
  try {
    const channel = await Channel.findOne()
    const query = { id, name }
    if (!channel) {
      await Channel.create(query)
    } else {
      await Channel.updateOne({}, query)
    }
  } catch (error) {
    logger.error(error)
  }
}

module.exports = {
  updateChannel
}
