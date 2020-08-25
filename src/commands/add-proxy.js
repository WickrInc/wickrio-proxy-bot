import State from '../state'
import logger from '../logger'
import APIService from '../services/api-service'

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
    const userID = argArray[0]
    const proxy = argArray[1]
    const userArray = [userID]
    // const userData = APIService.getUserInfo(userArray)
    // console.log(userData)
    const userInfo = APIService.getUserInfo(userArray)
    const failed = userInfo.failed
    if (
      argArray.length !== 2 ||
      userID === undefined ||
      userID === '' ||
      proxy === undefined ||
      proxy === ''
    ) {
      reply = 'Must have a UserID and Alias, usage: /add <UserID> <Alias>'
    } else if (failed !== undefined && userInfo.failed.length !== 0) {
      reply = `Cannot add proxy for ${userID}: User does not exist`
    } else {
      const members = this.proxyService.getMembers()
      logger.debug(`Here are the members ${members}`)
      this.proxyService.addMember(userID, proxy)
      logger.debug(`Here are the members after ${members}`)
      reply = `Alias "${proxy}" created for user ${userID}`
    }
    return {
      reply,
      state: State.NONE,
    }
  }
}

export default AddProxy
