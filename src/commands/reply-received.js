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
    const messageToSend = `Message from ${userEmail}:\n${message}`
    const uMessage = this.proxyService.replyMessage(userEmail, messageToSend)
    console.log('uMessage' + uMessage)
    const reply = ''
    return {
      reply,
      state: State.NONE,
    }
  }
}

module.exports = ReplyReceived
