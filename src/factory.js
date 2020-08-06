import State from './state'
import Help from './commands/help'
import AddProxy from './commands/add-proxy'
import SetAlias from './commands/set-alias'
import Send from './commands/send'
import SendFromRoom from './commands/send-from-room'
import RemoveMembers from './commands/remove-members'
import ListMembers from './commands/list-members'
import CreateRoom from './commands/create-room'
import Version from './commands/version'
import ReplyReceived from './commands/reply-received'

class Factory {
  constructor(proxyService) {
    this.addProxy = new AddProxy(proxyService)
    this.setAlias = new SetAlias(proxyService)
    this.removeMembers = new RemoveMembers(proxyService)
    this.listMembers = new ListMembers(proxyService)
    // this.help = new Help();
    this.createRoom = new CreateRoom(proxyService)
    this.version = new Version()
    this.send = new Send(proxyService)
    this.sendFromRoom = new SendFromRoom(proxyService)
    this.replyReceived = new ReplyReceived(proxyService)

    // Order matters here /commands must go first
    // TODO make it so that the order doesn' matter?
    this.adminCommandList = [
      // These are the /commands and must go first
      Help,
      this.addProxy,
      this.setAlias,
      this.createRoom,
      this.send,
      this.sendFromRoom,
      this.listMembers,
      Version,
      this.removeMembers,
      // Here are the options that rely on the current state
      (this.addProxy = new AddProxy(this.proxyService)),
    ]

    this.userCommandList = [Help, this.replyReceived, Version]
  }

  executeCommands(messageService) {
    let defaultReply
    let commandList
    if (messageService.getIsAdmin()) {
      commandList = this.adminCommandList
      defaultReply =
        'Command not recognized send the command /help for a list of commands'
    } else {
      commandList = this.userCommandList
      defaultReply = `${messageService.getUserEmail} is not authorized to use this bot. If you have a question, please get a hold of us a support@wickr.com or visit us a support.wickr.com. Thanks, Team Wickr`
    }
    for (const command of commandList) {
      if (command.shouldExecute(messageService)) {
        return command.execute(messageService)
      }
    }
    // TODO fix the admin command returning this then add it back
    if (messageService.getCommand === '/admin') return
    return {
      reply: defaultReply,
      state: State.NONE,
    }
  }
}

export default Factory
