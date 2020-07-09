const State = require('../state');
const logger = require('../logger');

// TODO use this instead of putting it in main!
class SetAlias {
  constructor(proxyService) {
    this.proxyService = proxyService;
    this.commandString = '/alias';
  }

  shouldExecute(messageService) {
    if (messageService.getCommand() === this.commandString) {
      return true;
    }
    return false;
  }

  execute(messageService) {
    let reply;
    const argArray = messageService.getArgument().split(' ');
    logger.debug(`argArray length:${argArray.length}`);
    logger.debug(`argArray:${argArray}`);
    if (argArray.length !== 2) {
      reply = 'Incorrect format, usage: /set <UserID> <Alias>';
    } else {
      const proxyObject = {
        userID: argArray[0],
        alias: argArray[1],
      };
      this.proxyService.setAlias(proxyObject);
      reply = `Alias "${argArray[1]}" created for user ${argArray[0]}`;
    }
    return {
      reply,
      state: State.NONE,
    };
  }
}

module.exports = SetAlias;
