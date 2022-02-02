import State from '../state'

// TODO use this instead of putting it in main!
class SetupAsset {
  constructor(proxyService) {
    this.proxyService = proxyService
    this.state = State.SETUP_ASSET
  }

  shouldExecute(messageService) {
    if (
      messageService.matchUserCommandCurrentState({
        commandState: this.state,
      }) &&
      // Check so that commands get preference
      !messageService.getCommand()
    ) {
      return true
    }
    return false
  }

  execute(messageService) {
    const message = messageService.getMessage()
    let reply = `Asset ${message} `
    const state = this.state
    if (messageService.getMessage().toLowerCase() === 'done') {
      return this.proxyService.setupCreateRoom()
    } else if (
      message === undefined ||
      message === '' ||
      message.split(' ').length !== 1
    ) {
      reply = 'Must have an asset to add. Enter asset in the format: <username>'
    } else {
      // TODO check for empty message
      const added = this.proxyService.addAsset(message)
      reply += added ? 'created' : 'already exists'
      reply +=
        '.\nEnter another asset in the format <username> or type "done" to finish'
    }
    return {
      reply,
      state,
    }
  }
}

module.exports = SetupAsset
