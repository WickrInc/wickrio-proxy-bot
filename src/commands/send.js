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

  async execute(messageService) {
    let reply
    const state = State.NONE
    const assets = this.proxyService.getAssets()
    const userEmail = messageService.getUserEmail()
    const argument = messageService.getArgument()
    if (argument === undefined || argument === '') {
      reply = 'Must have a message to send. Usage /send <message>'
    } else if (!this.proxyService.findUserByID(userEmail)) {
      reply = 'Before sending a message please set up a proxy for yourself'
    } else if (assets === undefined || assets.length === 0) {
      reply =
        'Before sending a message set up an asset you would like to send to'
    } else {
      // Check if sending from a precreated room
      let assetRoom
      assets.forEach(asset => {
        if (asset.getVGroupID() === messageService.getVGroupID()) {
          assetRoom = asset.getAsset()
        }
      })
      if (assetRoom) {
        await this.proxyService.sendMessage(userEmail, argument, assetRoom)
      } else {
        reply = 'Must first create a room with /create before sending a message'
      }
    }
    // TODO should we ask which asset if only one asset
    return {
      reply,
      state,
    }
  }
}

module.exports = Send
