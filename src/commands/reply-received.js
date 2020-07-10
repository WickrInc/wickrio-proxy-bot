import State from '../state'

// TODO use this instead of putting it in main!
class Send {
  constructor(proxyService) {
    this.proxyService = proxyService
    this.commandString = '/send'
  }

  shouldExecute(messageService) {
    console.log('Email:' + messageService.getUserEmail())
    console.log('UserD:' + this.proxyService.alias.userID)
    if (messageService.getUserEmail() === this.proxyService.alias.userID) {
      return true
    }
    return false
  }

  execute(messageService) {
    const uMessage = this.proxyService.replyMessage(messageService.getMessage())
    // const reply = `Sending message to ${this.proxyService.members[0].alias}`
    console.log('uMessage' + uMessage)
    const reply = ''
    return {
      reply,
      state: State.NONE,
    }
  }
}

module.exports = Send
