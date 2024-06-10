import State from '../state'

class WhichRoom {
  constructor(proxyService) {
    this.proxyService = proxyService
    this.state = State.WHICH_ROOM
    this.stateArray = [
      State.WHICH_ROOM,
      State.CREATE_ROOM_SETUP,
      State.WHICH_ROOM_SETUP,
    ]
  }

  shouldExecute(messageService) {
    for (const state of this.stateArray) {
      if (
        messageService.matchUserCommandCurrentState({ commandState: state }) &&
        // Check so that commands get preference
        !messageService.getCommand()
      ) {
        return true
      }
    }
    return false
  }

  async execute(messageService) {
    let reply
    let state = State.NONE
    const curState = messageService.getUserCurrentStateConstructor()
    const index = messageService.getMessage()
    const assets = this.proxyService.getAssets()
    if (curState === State.CREATE_ROOM_SETUP) {
      if (messageService.affirmativeReply()) {
        const asset = assets[0].getAsset()
        const title = await this.proxyService.createRoom(asset)
        reply = `Success! Navigate to the Wickr room called '${title}' to begin communicating with your team. At any point, you can type /help to get a list of available commands.`
      }
    } else if (!messageService.isInt() || index < 1 || index > assets.length) {
      reply = `Index: ${index} is out of range. Please enter an integer between 1 and ${assets.length}`
      state = curState
    } else {
      // Subtract one to account for 0 based indexing
      const asset = assets[parseInt(index, 10) - 1].getAsset()
      const title = await this.proxyService.createRoom(asset)

      reply = curState === State.WHICH_ROOM_SETUP ? 'Step 4 of 4: ' : ''
      reply += `Success! Navigate to the Wickr room called '${title}' to begin communicating with your team. At any point, you can type /help to get a list of available commands.`
    }
    const obj = {
      reply,
      state,
    }
    return obj
  }
}

export default WhichRoom
