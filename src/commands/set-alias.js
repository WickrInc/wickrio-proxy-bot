import State from '../state'
import logger from '../logger'

// TODO use this instead of putting it in main!
class SetAlias {
  constructor(proxyService) {
    this.proxyService = proxyService
    this.commandString = '/alias'
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
      reply = 'Incorrect format, usage: /set <UserID> <Alias>'
    } else {
      this.proxyService.setProxy(argArray[0], argArray[1])
      reply = `Alias "${argArray[1]}" created for user ${argArray[0]}`
    }
    return {
      reply,
      state: State.NONE,
    }
  }
}

module.exports = SetAlias
