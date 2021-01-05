import State from '../state'
// import logger from '../logger'

// TODO use this instead of putting it in main!
class Setup {
  constructor(proxyService) {
    this.proxyService = proxyService
    this.commandString = '/setup'
  }

  shouldExecute(messageService) {
    if (messageService.getCommand() === this.commandString) {
      return true
    }
    return false
  }

  execute(messageService) {
    const reply =
      'Setup Wizard Started\nStart by adding aliases to users one user at a time using: <username> <alias>'
    return {
      reply,
      state: State.SETUP_ALIAS,
    }
  }
}

module.exports = Setup
