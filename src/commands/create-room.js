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
    const reply = this.proxyService.createRoom()
    return {
      reply,
      state: State.NONE,
    }
  }
}

export default CreateRoom
