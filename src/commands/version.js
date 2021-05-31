import path from 'path'

import WickrIOBotAPI from 'wickrio-bot-api'
const bot = new WickrIOBotAPI.WickrIOBot()

class Version {
  constructor() {
    this.commandString = '/version'
  }

  shouldExecute(messageService) {
    if (messageService.getCommand() === this.commandString) {
      return true
    }
    return false
  }

  execute() {
    try {
      const packageJsonFile = path.join(process.cwd(), 'package.json')
      const reply = bot.getVersions(packageJsonFile)

      return {
        reply,
      }
    } catch (err) {
      const reply = 'Failed to get version information!'
      return {
        reply,
      }
    }
  }
}

module.exports = Version
