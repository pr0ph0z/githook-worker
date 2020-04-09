const fetch = require('node-fetch')
const logger = require('../utils/logger')

const getUserIdByUsername = async (username) => {
  try {
    let user = await fetch(`https://api.github.com/users/${username}`)
    user = await user.json()
    if (user.message !== undefined && user.message === 'Not Found') {
      return 'Not Found'
    }
    return user.id
  } catch (error) {
    logger.error(error)
  }
}

module.exports = {
  getUserIdByUsername
}
