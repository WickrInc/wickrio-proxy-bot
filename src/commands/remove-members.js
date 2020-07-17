import State from '../state'

// TODO use this instead of putting it in main!
class RemoveMembers {
  constructor(memberListRepo) {
    this.memberList = memberListRepo
    this.commandString = '/remove'
  }

  shouldExecute(messageService) {
    if (messageService.getCommand() === this.commandString) {
      return true
    }
    return false
  }

  execute(messageService) {
    const userEmail = messageService.getUserEmail()
    const members = messageService.getArgument.split(' ')
    let reply
    // TODO fix this!
    const memberList = this.memberList.getMemberList()
    const removeFails = []
    if (members === undefined || members.length === 0) {
      reply = 'Command contains no user names to remove!'
    } else {
      // TODO fix this for alias/ userEmail
      for (let i = 0; i < members.length; i++) {
        if (!memberList.includes(members[i])) {
          removeFails.push(members.splice(i, 1))
          i--
        }
      }
      if (removeFails.length >= 1) {
        reply =
          'Failed to remove some members, current list of members does not contain:\n'
        reply += removeFails.join('\n')
      }

      if (members.length >= 1) {
        for (let i = 0; i < members.length; i++) {
          memberList.splice(memberList.indexOf(members[i]), 1)
        }

        console.log('memberList', memberList)

        this.memberList.updateMemberList(memberList)
        // Send a message to all the current members
        reply += `${userEmail} has removed the following members from the member list:\n${members.join(
          '\n'
        )}`
        // const uMessage = this.whitelist.sendToWhitelist(doneReply);
      }
    }
    return {
      reply,
      state: State.NONE,
    }
  }
}

export default RemoveMembers
