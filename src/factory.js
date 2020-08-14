import State from './state'

// Commands
import AddProxy from './commands/add-proxy'
import AddAsset from './commands/add-asset'
import CreateRoom from './commands/create-room'
import Help from './commands/help'
import ListMembers from './commands/list-members'
import RemoveMembers from './commands/remove-members'
import ReplyReceived from './commands/reply-received'
import Send from './commands/send'
import SendFromRoom from './commands/send-from-room'
import Version from './commands/version'
import WhichAsset from './commands/which-asset'
import WhichRoom from './commands/which-room'

class Factory {
  constructor(proxyService) {
    this.proxyService = proxyService
    this.addProxy = new AddProxy(this.proxyService)
    this.addAsset = new AddAsset(this.proxyService)
    this.removeMembers = new RemoveMembers(this.proxyService)
    this.listMembers = new ListMembers(this.proxyService)
    this.createRoom = new CreateRoom(this.proxyService)
    this.version = new Version()
    this.send = new Send(this.proxyService)
    this.sendFromRoom = new SendFromRoom(this.proxyService)
    this.replyReceived = new ReplyReceived(this.proxyService)
    // Here are the options that rely on the current state
    this.whichAsset = new WhichAsset(this.proxyService)
    this.whichRoom = new WhichRoom(this.proxyService)

    // Order matters here /commands must go first
    this.adminCommandList = [this.addProxy, this.addAsset, this.removeMembers]

    this.userCommandList = [
      this.whichAsset,
      this.createRoom,
      Help,
      this.listMembers,
      this.send,
      this.sendFromRoom,
      Version,
      this.whichRoom,
    ]

    this.assetCommandList = [this.replyReceived]
  }

  executeCommands(messageService) {
    const userEmail = messageService.getUserEmail()
    let defaultReply = `${userEmail} is not authorized to use this bot. If you have a question, please get a hold of us a support@wickr.com or visit us a support.wickr.com. Thanks, Team Wickr`
    let commandList
    if (messageService.getIsAdmin()) {
      commandList = this.adminCommandList.concat(this.userCommandList)
      defaultReply =
        'Command not recognized send the command /help for a list of commands'
    } else if (this.proxyService.findUserByID(userEmail)) {
      commandList = this.userCommandList
    } else {
      commandList = this.assetCommandList
    }
    for (const command of commandList) {
      if (command.shouldExecute(messageService)) {
        return command.execute(messageService)
      }
    }
    // TODO fix the admin command returning this then add it back
    if (messageService.getCommand() === '/admin') return
    return {
      reply: defaultReply,
      state: State.NONE,
    }
  }
}

export default Factory
