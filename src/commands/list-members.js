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
      for (const member of members) {
        userString += `${member.userID}, ${member.proxyID}\n`
      }
      reply = `Current members:\n${userString}`
      reply += 'Current Asset:'
      if (asset !== undefined && asset.length !== 0) {
        reply += `\n${asset}`
      }
    }
    const obj = {
      reply,
      state: State.NONE,
    }
    return obj
  }
}

export default ListMembers
