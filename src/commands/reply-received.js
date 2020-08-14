import State from '../state'

class ReplyReceived {
  constructor(proxyService) {
    this.proxyService = proxyService
  }

  shouldExecute(messageService) {
    if (this.proxyService.findAssetByID(messageService.getUserEmail())) {
      return true
    }
    return false
  }

  execute(messageService) {
    const userEmail = messageService.getUserEmail()
    const message = messageService.getMessage()
    const uMessage = this.proxyService.replyMessage(userEmail, message)
    console.log('uMessage' + uMessage)
    const reply = ''
    return {
      reply,
      state: State.NONE,
    }
  }
}

module.exports = ReplyReceived
