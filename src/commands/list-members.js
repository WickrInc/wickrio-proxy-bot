import State from '../state'

class ListMembers {
  constructor(memberListRepository) {
    this.memberList = memberListRepository
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
    const members = this.memberList.getMemberList()
    let reply
    if (members === undefined || members.length === 0) {
      reply = 'List of members is currently empty'
    } else {
      const userList = members.join('\n')
      reply = `Current members:\n${userList}`
      let userString = ''
      for (let i = 0; i < members.length - 1; i += 1) {
        userString += `${members[i].userID}, ${members[i].alias}\n`
      }
      userString += `${members[members.length - 1].userID}, ${
        members[members.length - 1].alias
      }`
      reply = `Current members:\n${userString}`
    }
    const obj = {
      reply,
      state: State.NONE,
    }
    return obj
  }
}

export default ListMembers
