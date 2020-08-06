import State from '../state'
import logger from '../logger'
// import APIService from '../services/api-service'

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
    // const userArray = [argArray[0]]
    // const validUser = APIService.getUserInfo(userArray).failed !== []
    if (argArray.length !== 2) {
      reply = 'Incorrect format, usage: /add <UserID> <Alias>'
      // } else if (!validUser) {
      //   reply = `Cannot add proxy for ${argArray[0]} user does not exist`
    } else {
      // this.proxyService.addProxyID(argArray[0], argArray[1]);
      const members = this.proxyService.getMembers()
      logger.debug(`Here are the members ${members}`)
      this.proxyService.addProxyID(argArray[0], argArray[1])
      logger.debug(`Here are the members after ${members}`)
      reply = `Alias "${argArray[1]}" created for user ${argArray[0]}`
    }
    return {
      reply,
      state: State.NONE,
    }
  }
}

export default AddProxy
