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
    // logger.debug(`argArray length:${argArray.length}`)
    // logger.debug(`argArray:${argArray}`)
    const userID = argArray[0]
    const proxy = argArray[1]
    const userArray = [userID]
    const userData = APIService.getUserInfo(userArray)
    console.log(userData)
    const userInfo = JSON.parse(APIService.getUserInfo(userArray))
    // const failed = userInfo.failed
    console.log({ userInfo })
    // logger.debug(typeof userInfo)
    // logger.debug(Object.keys(userInfo))
    // logger.debug(`UserObject: ${userInfo}`)
    // logger.debug(`UserObject.users: ${userInfo.users}`)
    // console.log('Failed?' + failed)
    // console.log({ failed })
    // console.log(Array.isArray(failed))
    // console.log(typeof userInfo.failed)
    // console.log(userInfo.failed.keys())
    // console.log(userInfo.failed !== [])
    // console.log(userInfo.failed !== undefined)
    // console.log(userInfo.failed !== '')
    // console.log(failed[0])
    // console.log({ users: userInfo.users })
    // console.log(typeof userInfo.users)
    // console.log(typeof userInfo.users[0])
    // console.log(Array.isArray([]))
    if (argArray.length !== 2) {
      reply = 'Incorrect format, usage: /add <UserID> <Alias>'
      // } else if (failed !== []) {
      //   reply = `Cannot add proxy for ${argArray[0]}: User does not exist`
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
