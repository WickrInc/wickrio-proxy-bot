const fs = require('fs');
const State = require('./state');
const Help = require('./commands/help');
const logger = require('./logger');
const AddProxy = require('./commands/add-proxy');
const SetAlias = require('./commands/set-alias');
const Send = require('./commands/send');
const SendFromRoom = require('./commands/send-from-room');
const RemoveMembers = require('./commands/remove-members');
const ListMembers = require('./commands/list-members');
const CreateRoom = require('./commands/create-room');
const Version = require('./commands/version');

class Factory {
  constructor(memberListRepo) {
    this.addProxy = new AddProxy(memberListRepo);
    this.setAlias = new SetAlias(memberListRepo);
    this.removeMembers = new RemoveMembers(memberListRepo);
    this.listMembers = new ListMembers(memberListRepo);
    // this.help = new Help();
    this.createRoom = new CreateRoom(memberListRepo);
    this.send = new Send(memberListRepo);
    this.sendFromRoom = new SendFromRoom(memberListRepo);

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
      // Here are the options that rely on the current state

    ];
  }

  execute(messageService) {
    for (const command of this.commandList) {
      if (command.shouldExecute(messageService)) {
        return command.execute(messageService);
      }
    }
    // TODO fix the admin command returning this then add it back
    return {
      reply: 'Command not recognized send the command /help for a list of commands',
      state: State.NONE,
    };
  }
}

module.exports = Factory;
