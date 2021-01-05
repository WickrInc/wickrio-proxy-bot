import State from '../state'
// import logger from '../logger'

// TODO use this instead of putting it in main!
class SetupAsset {
  constructor(proxyService) {
    this.proxyService = proxyService
    this.state = State.SETUP_ASSET
  }

  shouldExecute(messageService) {
    if (
      messageService.getCurrentState() === this.state &&
      // Check so that commands get preference
      !messageService.getCommand()
    ) {
      return true
    }
    return false
  }

  execute(messageService) {
    const message = messageService.getArgument()
    let reply = `Asset ${message} added`
    let state
    if (messageService.getMessage().toLower() === 'done') {
      reply =
        'Setup Complete use the /create command to create a room with an asset of your choosing and the members with created aliases'
      state = State.NONE
    } else if (
      message === undefined ||
      message === '' ||
      message.split(' ').length !== 1
    ) {
      reply = 'Must have an asset to add. Usage: <username>'
      state = this.state
    } else {
      // TODO check for empty message
      const added = this.proxyService.addAsset(message)
      reply += added ? ' created' : ' already exists'
      state = this.state
    }
    return {
      reply,
      state,
    }
  }
}

module.exports = SetupAsset
