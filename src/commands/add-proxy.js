const State = require('../state');

// TODO use this instead of putting it in main!
class AddProxy {
  constructor(proxyService) {
    this.proxyService = proxyService;
    this.commandString = '/add';
  }

  shouldExecute(messageService) {
    if (messageService.getCommand() === this.commandString) {
      return true;
    }
    return false;
  }

  execute(messageService) {
    let reply;
    const argArray = messageService.getArgument().split();
    if (!argArray.length === 2) {
      reply = 'Incorrect format, usage: /add <UserID> <Alias>';
    } else {
      this.proxyService.addProxyID(argArray[0], argArray[1]);
      reply = `Alias ${argArray[1]} created for user ${argArray[0]}`;
    }
    return {
      reply,
      state: State.NONE,
    };
  }
}

export default AddProxy;
