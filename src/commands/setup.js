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
      'Setup Wizard Started\nStep 1 of 4: To get started, create an alias for yourself or your teammate one user at a time in the format: <user@email.com> <alias>'
    return {
      reply,
      state: State.SETUP_ALIAS,
    }
  }
}

module.exports = Setup
