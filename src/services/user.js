const User = require('../models/user')
const logger = require('../utils/logger')

const updateUser = async ({ github, discord }) => {
  try {
    await User.updateOne({
      $or: [
        { 'github.username': github.username },
        { 'discord.id': discord.id }
      ]
    },
    { github, discord },
    { upsert: true })
  } catch (error) {
    logger.error(error)
  }
}

module.exports = {
  updateUser
}
