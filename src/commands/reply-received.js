import State from '../state'

class ReplyReceived {
  constructor(proxyService) {
    this.proxyService = proxyService
  }

  shouldExecute(messageService) {
    const userEmail = messageService.getUserEmail()
    if (this.proxyService.findAssetByID(userEmail)) {
      return true
    }
    return false
  }

  async execute(messageService) {
    const userEmail = messageService.getUserEmail()
    const message = messageService.getMessage()
    const messageToSend = `Message from ${userEmail}:\n${message}`
    const uMessage = await this.proxyService.replyMessage(
      userEmail,
      messageToSend
    )
    const reply = uMessage ? '' : 'Message not delivered'
    return {
      reply,
      state: State.NONE,
    }
  }
}

module.exports = ReplyReceived
