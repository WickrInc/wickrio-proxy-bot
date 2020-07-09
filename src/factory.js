import Help from './commands/help';
// import AddMembers from './commands/add-members'
import RemoveMembers from './commands/remove-members';
import ListMembers from './commands/list-members';
import CreateRoom from './commands/create-room';
import Version from './commands/version';
import AddProxy from './commands/add-proxy';

const fs = require('fs');
const MemberListRepo = require('./helpers/member-list');

// TODO consts vs this's
const memberListRepo = new MemberListRepo(fs);

class Factory {
  factory(proxyService) {
    // this.addMembers = new AddMembers(memberListRepo);
    this.proxyService = proxyService;
    this.removeMembers = new RemoveMembers(memberListRepo);
    this.listMembers = new ListMembers(memberListRepo);
    this.help = new Help();
    this.createRoom = new CreateRoom();
    this.version = new Version();

    // Order matters here /commands must go first
    // TODO make it so that the order doesn' matter?
    this.commandList = [
      // These are the /commands and must go first
      this.help,
      // Here are the options that rely on the current state
      this.addProxy = new AddProxy(this.proxyService),

    ];
  }

  execute(messageService) {
    for (const command of this.commandList) {
      if (command.shouldExecute(messageService)) {
        return command.execute(messageService);
      }
    }
    // TODO fix the admin command returning this then add it back
    // return {
    //   reply: 'Command not recognized send the command /help for a list of commands',
    //   state: State.NONE,
    // };
  }
}

export default Factory;
