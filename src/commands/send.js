import State from '../state'

// TODO use this instead of putting it in main!
class Send {
  constructor(proxyService) {
    this.proxyService = proxyService
    this.commandString = '/send'
  }

  shouldExecute(messageService) {
    if (messageService.getCommand() === this.commandString) {
      return true
    }

    return false
  }

  execute(messageService) {
    let reply
    const asset = this.proxyService.getAsset()
    const userEmail = messageService.getUserEmail()
    const argument = messageService.getArgument()
    if (argument === undefined || argument === '') {
      reply = 'Must have a message to send. Usage /send <message>'
    } else if (asset === undefined || asset === '') {
      reply =
        'Before sending a message set up an asset you would like to send to'
    } else if (!this.proxyService.findUserByID(userEmail)) {
      reply = 'Before sending a message please set up a proxy for yourself'
    }
    this.proxyService.sendMessage(userEmail, argument)
    return {
      reply,
      state: State.NONE,
    }
  }
}

module.exports = Send
