import State from '../state'

class ListMembers {
  constructor(proxyService) {
    this.proxyService = proxyService
    this.commandString = '/list'
  }

  shouldExecute(messageService) {
    if (messageService.getCommand() === this.commandString) {
      return true
    }
    return false
  }

  execute(messageService) {
    // TODO test
    const asset = this.proxyService.getAsset()
    const members = this.proxyService.getMembers()
    let reply
    if (members === undefined || members.length === 0) {
      reply = 'List of members is currently empty'
    } else {
      let userString = ''
      for (let i = 0; i < members.length - 1; i += 1) {
        userString += `${members[i].userID}, ${members[i].alias}\n`
      }
      userString += `${members[members.length - 1].userID}, ${
        members[members.length - 1].alias
      }`
      reply = `Current members:\n${userString}`
      reply += `\nCurrent Asset:\n${asset}`
    }
    const obj = {
      reply,
      state: State.NONE,
    }
    return obj
  }
}

export default ListMembers
