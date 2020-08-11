const { findUserByGithubId } = require('../services/user')
const { getChannel } = require('../services/channel')

const parseMessage = async (message) => {
  const messages = {}
  let assignee, reviewer
  message = JSON.parse(message)
  message.type = message.type.replace('_', ' ')
  const article = message.type === 'issue' ? 'an' : 'a'

  const sender = await findUserByGithubId(message.sender.github_id)
  const userTarget = sender === null ? `\`${message.sender.username}\`` : `<@!${sender.discord.id}>`

  if (message.assignee !== undefined) {
    assignee = await findUserByGithubId(message.assignee.github_id)
  }
  if (message.reviewer !== undefined) {
    reviewer = await findUserByGithubId(message.reviewer.github_id)
  }
  const channel = await getChannel()

  switch (message.action) {
    case 'create':
      messages.server = {
        id: channel.id,
        message: `${userTarget} just created ${article} ${message.type} in **${message.repository_name}** named \`${message.title} (#${message.number})\`. ${message.url}`
      }
      break
    case 'closed':
      messages.server = {
        id: channel.id,
        message: `${userTarget} just closed ${article} ${message.type} in **${message.repository_name}** named \`${message.title} (#${message.number})\`. ${message.url}`
      }
      break
    case 'assigned_issue':
      if (assignee !== null) {
        messages.direct_message = {
          id: assignee.discord.id,
          message: `Hi ${message.assignee.username}, you've been assigned to ${article} ${message.type} in **${message.repository_name}** named \`${message.title} (#${message.number})\`. ${message.url}`
        }
      }
      break
    case 'assigned_pull_request':
      if (assignee !== null) {
        messages.direct_message = {
          id: assignee.discord.id,
          message: `Hi ${message.assignee.username}, you've been assigned to ${article} ${message.type} in **${message.repository_name}** named \`${message.title} (#${message.number})\`. ${message.url}`
        }
      }
      break
    case 'review_pull':
      if (reviewer !== null) {
        messages.direct_message = {
          id: reviewer.discord.id,
          message: `Hi ${message.reviewer.username}, you've been requested to review ${article} ${message.type} in **${message.repository_name}** named \`${message.title} (#${message.number})\` by ${sender.github.username}. ${message.url}`
        }
      }
      break
    case 'changes_requested':
      messages.direct_messages = []
      for (const assignee of message.assignees) {
        const assigneeUser = await findUserByGithubId(assignee.github_id)
        if (assigneeUser !== null) {
          messages.direct_messages.push({
            id: assigneeUser.discord.id,
            message: `Hi ${assignee.username}, your subscribed pull request in **${message.repository_name}** named \`${message.title} (#${message.number})\` has been requested to change by ${sender.github.username}. ${message.url}`
          })
        }
      }
      break
    case 'approved':
      messages.direct_messages = []
      for (const assignee of message.assignees) {
        const assigneeUser = await findUserByGithubId(assignee.github_id)
        if (assigneeUser !== null) {
          messages.direct_messages.push({
            id: assigneeUser.discord.id,
            message: `Hi ${assignee.username}, your subscribed pull request in **${message.repository_name}** named \`${message.title} (#${message.number})\` has been approved by ${sender.github.username}. ${message.url}`
          })
        }
      }
      break
  }

  return messages
}

module.exports = {
  parseMessage
}
