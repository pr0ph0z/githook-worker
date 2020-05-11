require('dotenv').config()
const fetch = require('node-fetch')

const getUserIdByUsername = async (username) => {
  let user = await fetch(`https://api.github.com/users/${username}`)
  user = await user.json()

  if (user.message !== undefined && user.message === 'Not Found') {
    return 'Not Found'
  }

  return user.id
}

const getOrgEvents = async (octokit) => {
  const events = await octokit.activity.listOrgEventsForAuthenticatedUser({
    username: process.env.GITHUB_USERNAME,
    org: process.env.GITHUB_ORG
  })

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999)

  return events.data
    .filter(event => new Date(event.created_at) > startOfDay && new Date(event.created_at) < endOfDay)
    .map(event => ({ actor: event.actor.display_login }))
}

module.exports = {
  getUserIdByUsername,
  getOrgEvents
}
