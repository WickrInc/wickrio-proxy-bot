import State from '../state'
import APIService from '../services/api-service'

class SetupAlias {
  constructor(proxyService) {
    this.proxyService = proxyService
    this.state = State.SETUP_ALIAS
  }

  shouldExecute(messageService) {
    if (
      messageService.getCurrentState() === this.state &&
      // Check so that commands get preference
      !messageService.getCommand()
    ) {
      return true
    }
    return false
  }

  execute(messageService) {
    const argArray = messageService.getMessage().split(' ')
    const userID = argArray[0]
    const proxy = argArray[1]
    const userArray = [userID]
    const userInfo = APIService.getUserInfo(userArray)
    const failed = userInfo.failed
    let reply
    let state
    if (messageService.getMessage().toLowerCase() === 'done') {
      reply =
        "Step 2 of 4: Great! Now create your assets one at a time by typing asset's WickrMe username. Make sure to add the right WickrMe user as an asset."
      state = State.SETUP_ASSET
    } else if (
      argArray.length !== 2 ||
      userID === undefined ||
      userID === '' ||
      proxy === undefined ||
      proxy === ''
    ) {
      reply = 'Must have a UserID and Alias, format: <UserID> <Alias>'
      state = this.state
    } else if (failed !== undefined && userInfo.failed.length !== 0) {
      reply = `Cannot add proxy for ${userID}: User does not exist`
      state = this.state
    } else {
      this.proxyService.addMember(userID, proxy)
      reply = `The alias "${proxy}" has been created for the user ${userID}.\nAdd another alias using the same format or type "done" to continue`
      state = this.state
    }

    const obj = {
      reply,
      state,
    }
    return obj
  }
}

export default SetupAlias
