import State from '../state'
import APIService from '../services/api-service'

class SetupAlias {
  constructor(proxyService) {
    this.proxyService = proxyService
    this.state = State.SETUP_ALIAS
  }

  shouldExecute(messageService) {
    if (
      messageService.matchUserCommandCurrentState({
        commandState: this.state,
      }) &&
      // TODO Check so that commands get preference currently messageSErvice always has command
      !messageService.getCommand()
    ) {
      return true
    }
    return false
  }

  async execute(messageService) {
    const argArray = messageService.getMessage().split(' ')
    const userID = argArray[0]
    const proxy = argArray[1]
    const userArray = [userID]
    const userInfo = await APIService.getUserInfo(userArray)
    const failed = userInfo.failed
    let reply
    let state = this.state
    if (messageService.getMessage().toLowerCase() === 'done') {
      if (this.proxyService.getMembers().length < 1) {
        reply =
          'Must create at least one alias to proceed. Add an alias for yourself or a teammate in the format <user@email.com> <alias>'
      } else {
        reply =
          "Step 2 of 4: Great! Now create your assets one at a time by typing the asset's WickrMe username. Make sure to add the right WickrMe user as an asset in the format <username>"
        state = State.SETUP_ASSET
      }
    } else if (
      argArray.length !== 2 ||
      userID === undefined ||
      userID === '' ||
      proxy === undefined ||
      proxy === ''
    ) {
      reply =
        'Must have an email and alias. Add an alias for yourself or teammate in the format <user@email.com> alias>'
    } else if (failed !== undefined && userInfo.failed.length !== 0) {
      reply = `Cannot add alias for ${userID}: User does not exist. `
      reply +=
        'Add an alias for yourself or teammate in the format <user@email.com> <alias>'
    } else {
      this.proxyService.addMember(userID, proxy)
      reply = `The alias "${proxy}" has been created for the user ${userID}.\nAdd another alias using the same format or type "done" to continue`
    }

    const obj = {
      reply,
      state,
    }
    return obj
  }
}

export default SetupAlias
