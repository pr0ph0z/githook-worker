const User = require('../models/user')

const updateUser = async ({ github, discord }) => {
  await User.updateOne({
    $or: [
      { 'github.username': github.username },
      { 'discord.id': discord.id }
    ]
  },
  { github, discord },
  { upsert: true })
}

const findUserByGithubId = async (githubId) => {
  const user = await User.findOne({ 'github.id': githubId })

  return user
}

module.exports = {
  updateUser,
  findUserByGithubId
}
