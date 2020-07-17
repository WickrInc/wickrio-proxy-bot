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
    if (
      messageService.getArgument() === undefined ||
      messageService.getArgument() === ''
    ) {
      reply = 'Must have a message to send. Usage /send <message>'
    } else if (this.proxyService.alias === undefined) {
      reply =
        'Before sending a message set up an alias you would like to send to'
    } else if (this.proxyService.members === undefined) {
      reply = 'Before sending a message please set up a proxy for yourself'
    }
    // reply = `Message sent to ${this.proxyService.alias.alias}`
    this.proxyService.sendMessage(
      messageService.getUserEmail(),
      messageService.getArgument()
    )
    return {
      reply,
      state: State.NONE,
    }
  }
}

module.exports = Send
