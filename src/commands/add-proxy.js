import State from '../state'
import logger from '../logger'

// TODO use this instead of putting it in main!
class AddProxy {
  constructor(proxyService) {
    this.proxyService = proxyService
    this.commandString = '/add'
  }

  shouldExecute(messageService) {
    if (messageService.getCommand() === this.commandString) {
      return true
    }
    return false
  }

  execute(messageService) {
    let reply
    const argArray = messageService.getArgument().split(' ')
    logger.debug(`argArray length:${argArray.length}`)
    logger.debug(`argArray:${argArray}`)
    if (argArray.length !== 2) {
      reply = 'Incorrect format, usage: /add <UserID> <Alias>'
    } else {
      // this.proxyService.addProxyID(argArray[0], argArray[1]);
      const members = this.proxyService.getMemberList()
      logger.debug(`Here are the members ${members}`)
      const proxyObject = {
        userID: argArray[0],
        alias: argArray[1],
      }
      members.push(proxyObject)
      logger.debug(`Here are the members after ${members}`)
      this.proxyService.updateMemberList(members)
      reply = `Alias "${argArray[1]}" created for user ${argArray[0]}`
    }
    return {
      reply,
      state: State.NONE,
    }
  }
}

export default AddProxy
