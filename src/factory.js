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
  constructor(memberListRepo) {
    this.addProxy = new AddProxy(memberListRepo)
    this.setAlias = new SetAlias(memberListRepo)
    this.removeMembers = new RemoveMembers(memberListRepo)
    this.listMembers = new ListMembers(memberListRepo)
    // this.help = new Help();
    this.createRoom = new CreateRoom(memberListRepo)
    this.version = new Version()
    this.send = new Send(memberListRepo)
    this.sendFromRoom = new SendFromRoom(memberListRepo)
    this.replyReceived = new ReplyReceived(memberListRepo)

    // Order matters here /commands must go first
    // TODO make it so that the order doesn' matter?
    this.commandList = [
      // These are the /commands and must go first
      Help,
      this.addProxy,
      this.setAlias,
      this.createRoom,
      this.send,
      this.sendFromRoom,
      this.listMembers,
      Version,
      this.replyReceived,
      // Here are the options that rely on the current state
      (this.addProxy = new AddProxy(this.proxyService)),
    ]
  }

  execute(messageService) {
    for (const command of this.commandList) {
      if (command.shouldExecute(messageService)) {
        return command.execute(messageService)
      }
    }
    // TODO fix the admin command returning this then add it back
    return {
      reply:
        'Command not recognized send the command /help for a list of commands',
      state: State.NONE,
    }
  }
}

export default Factory
