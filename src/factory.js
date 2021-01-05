import State from './state'

// Commands
import AddProxy from './commands/add-proxy'
import AddAsset from './commands/add-asset'
import Cancel from './commands/cancel'
import CreateRoom from './commands/create-room'
import Help from './commands/help'
import ListMembers from './commands/list-members'
import RemoveAsset from './commands/remove-asset'
import RemoveMembers from './commands/remove-members'
import ReplyReceived from './commands/reply-received'
import Send from './commands/send'
import Setup from './commands/setup'
import Version from './commands/version'
// import WhichAsset from './commands/which-asset'
import WhichRoom from './commands/which-room'

class Factory {
  constructor(proxyService) {
    this.proxyService = proxyService
    this.addProxy = new AddProxy(this.proxyService)
    this.addAsset = new AddAsset(this.proxyService)
    this.removeAsset = new RemoveAsset(this.proxyService)
    this.removeMembers = new RemoveMembers(this.proxyService)
    this.listMembers = new ListMembers(this.proxyService)
    this.createRoom = new CreateRoom(this.proxyService)
    this.version = new Version()
    this.send = new Send(this.proxyService)
    this.setup = new Setup(this.proxyService)
    this.replyReceived = new ReplyReceived(this.proxyService)
    // Here are the options that rely on the current state
    // this.whichAsset = new WhichAsset(this.proxyService)
    this.whichRoom = new WhichRoom(this.proxyService)

    // Order matters here /commands must go first
    this.adminCommandList = [
      this.addProxy,
      this.addAsset,
      this.removeAsset,
      this.removeMembers,
      this.setup,
    ]

    this.userCommandList = [
      // this.whichAsset,
      Cancel,
      this.createRoom,
      Help,
      this.listMembers,
      this.send,
      Version,
      this.whichRoom,
    ]

    this.assetCommandList = [this.replyReceived]
  }

  executeCommands(messageService) {
    const userEmail = messageService.getUserEmail()
    // TODO fix this when in a room
    let defaultReply = `${userEmail} is not authorized to use this bot. If you have a question, please get a hold of us a support@wickr.com or visit us a support.wickr.com. Thanks, Team Wickr`
    let commandList
    // If in a created asset room ignore messages that aren't commands
    if (this.proxyService.isAssetRoom(messageService.getVGroupID())) {
      console.log('inAsset room ' + messageService.getCommand())
      if (!messageService.getCommand() || messageService.getCommand() === '') {
        defaultReply = ''
      } else {
        defaultReply =
          'Command not recognized send the command /help for a list of commands'
      }
    } else if (messageService.getIsAdmin()) {
      // TODO give this reply on spelling mistake even in asset rooms
      defaultReply =
        'Command not recognized send the command /help for a list of commands'
    }

    if (messageService.getIsAdmin()) {
      commandList = this.adminCommandList.concat(this.userCommandList)
      // Check if the user isn't an admin but is a member of the group
    } else if (this.proxyService.findUserByID(userEmail)) {
      commandList = this.userCommandList
    } else if (this.proxyService.isAsset(userEmail)) {
      commandList = this.assetCommandList
    } else {
      return {
        reply: defaultReply,
        state: State.NONE,
      }
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
