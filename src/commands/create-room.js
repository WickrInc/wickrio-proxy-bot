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

  async execute(messageService) {
    let reply
    let state = State.NONE
    const users = this.proxyService.getMembers()
    const assets = this.proxyService.getAssets()
    if (users === undefined || users.length === 0) {
      reply =
        'You must have at least one Alias member before you can create a room. Add an alias using /add <email> <alias>.'
    } else if (assets === undefined || assets.length === 0) {
      reply =
        'You must have at least one Asset before you can create a room. Add an asset using /asset <username>.'
    } else if (assets.length === 1) {
      const title = await this.proxyService.createRoom(assets[0].getAsset())
      reply = `Success! Navigate to the Wickr room called '${title}' to begin communicating with your team. At any point, you can type /help to get a list of available commands.`
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
