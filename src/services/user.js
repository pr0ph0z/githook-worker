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

const findUserByGithubId = async (githubId) => {
  try {
    const user = await User.findOne({ 'github.id': githubId })

    return user
  } catch (error) {
    logger.error(error)
    return false
  }
}

module.exports = {
  updateUser,
  findUserByGithubId
}
