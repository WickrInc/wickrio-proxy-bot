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
    const assets = this.proxyService.getAssets()
    const members = this.proxyService.getMembers()
    let reply = 'Current Members:'
    if (members === undefined || members.length === 0) {
      reply += '\nList of members is currently empty'
    } else {
      members.forEach(member => {
        reply += `\n${member.userID}, ${member.proxyID}`
      })
    }
    reply += '\nCurrent Assets:'
    if (assets === undefined || assets.length === 0) {
      reply += '\nList of assets is currently empty'
    } else {
      assets.forEach(asset => {
        reply += `\n${asset.asset}`
      })
    }
    const obj = {
      reply,
      state: State.NONE,
    }
    return obj
  }
}

export default ListMembers
