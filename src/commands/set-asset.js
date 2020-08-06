import State from '../state'
// import logger from '../logger'

// TODO use this instead of putting it in main!
class SetAsset {
  constructor(proxyService) {
    this.proxyService = proxyService
    this.commandString = '/asset'
  }

  shouldExecute(messageService) {
    if (messageService.getCommand() === this.commandString) {
      return true
    }
    return false
  }

  execute(messageService) {
    const argument = messageService.getArgument()
    this.proxyService.setAndSaveAsset(argument)
    const reply = `Asset ${argument} created`
    return {
      reply,
      state: State.NONE,
    }
  }
}

module.exports = SetAsset
