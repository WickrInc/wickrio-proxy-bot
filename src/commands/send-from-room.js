import State from '../state'

// TODO use this instead of putting it in main!
class Send {
  constructor(proxyService) {
    this.proxyService = proxyService
    this.commandString = '/send'
  }

  shouldExecute(messageService) {
    if (messageService.getVGroupID() === this.proxyService.vGroupID) {
      return true
    }
    return false
  }

  execute(messageService) {
    const reply = this.proxyService.sendMessage(messageService.getMessage())
    return {
      reply,
      state: State.NONE,
    }
  }
}

export default Send
