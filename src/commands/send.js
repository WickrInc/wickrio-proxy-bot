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
    let state = State.NONE
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
    } else if (assets.length === 1) {
      this.proxyService.sendMessage(userEmail, argument, assets[0].getAsset())
    } else {
      // Check if sending from a precreated room
      let assetRoom
      assets.forEach(asset => {
        if (asset.getVGroupID() === messageService.getVGroupID()) {
          assetRoom = asset.getAsset()
        }
      })
      if (assetRoom) {
        this.proxyService.sendMessage(userEmail, argument, assetRoom)
      } else {
        let i = 1
        reply = 'Which asset would you like to send to?'
        assets.forEach(asset => {
          reply += `\n${i}: ${asset.asset}`
          i += 1
        })
        state = State.WHICH_ASSET
        // TODO make this more robust
        messageService.user.message = messageService.getArgument()
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
