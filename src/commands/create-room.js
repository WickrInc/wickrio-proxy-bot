import State from '../state'

// TODO use this instead of putting it in main!
class CreateRoom {
  constructor(proxyService) {
    this.proxyService = proxyService
    this.commandString = '/create'
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
    const users = this.proxyService.getMembers()
    const assets = this.proxyService.getAssets()
    if (users === undefined || users.length === 0) {
      reply = 'No members to create a room'
    } else if (assets === undefined || assets.length === 0) {
      reply = 'No asset to send to set an asset with /asset'
    } else if (assets.length === 1) {
      this.proxyService.createRoom(assets[0])
      reply = 'Room created'
    } else {
      let i = 1
      reply = 'Which asset would you like to create a room with?'
      assets.forEach(asset => {
        reply += `\n${i}: ${asset.asset}`
        i += 1
      })
      state = State.WHICH_ROOM
    }
    return {
      reply,
      state,
    }
  }
}

export default CreateRoom
