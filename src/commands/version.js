import path from 'path'

import WickrIOBotAPI from 'wickrio-bot-api'
const bot = new WickrIOBotAPI.WickrIOBot()

class Version {
  static shouldExecute(messageService) {
    if (messageService.getCommand() === '/version') {
      return true
    }
    return false
  }

  static execute() {
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

export default Version
