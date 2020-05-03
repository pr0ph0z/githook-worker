const fetch = require('node-fetch')

const getUserIdByUsername = async (username) => {
  let user = await fetch(`https://api.github.com/users/${username}`)
  user = await user.json()

  if (user.message !== undefined && user.message === 'Not Found') {
    return 'Not Found'
  }

  return user.id
}

module.exports = {
  getUserIdByUsername
}
