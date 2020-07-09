import WickrIOAPI from 'wickrio_addon';
import WickrIOBotAPI from 'wickrio-bot-api';
import fs from 'fs';

import ProxyService from './services/proxy-service';
import MessageService from './services/message-service';

import Factory from './factory';
import logger from './logger';

const { WickrUser } = WickrIOBotAPI;
const bot = new WickrIOBotAPI.WickrIOBot();
const factory = new Factory(ProxyService);

let currentState;

process.stdin.resume(); // so the program will not close instantly

async function exitHandler(options, err) {
  try {
    const closed = await bot.close();
    if (err || options.exit) {
      logger.error('Exit reason:', err);
      process.exit();
    } else if (options.pid) {
      process.kill(process.pid);
    }
  } catch (err) {
    logger.error(err);
  }
}

// catches ctrl+c and stop.sh events
process.on('SIGINT', exitHandler.bind(null, {
  exit: true,
}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {
  pid: true,
}));
process.on('SIGUSR2', exitHandler.bind(null, {
  pid: true,
}));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {
  exit: true,
}));

async function main() {
  // debug('Entering main!');
  try {
    const tokens = JSON.parse(process.env.tokens);
    let status;
    if (process.argv[2] === undefined) {
      status = await bot.start(tokens.WICKRIO_BOT_NAME.value);
    } else {
      status = await bot.start(process.argv[2]);
    }
    if (!status) {
      exitHandler(null, {
        exit: true,
        reason: 'Client not able to start',
      });
    }
    await bot.startListening(listen); // Passes a callback function that will receive incoming messages into the bot client
    // /////////////////////
    // Start coding below and modify the listen function to your needs
    // /////////////////////
  } catch (err) {
    logger.error(err);
  }
}

function listen(incomingMessage) {
  try {
    // Parses an incoming message and returns and object with command, argument,
    // vGroupID and Sender fields
    const parsedMessage = bot.parseMessage(incomingMessage);
    if (!parsedMessage) {
      return;
    }
    logger.debug('New incoming Message:', parsedMessage);
    let wickrUser;
    // TODO is this ok formatting??
    // combine all into one line
    const { command } = parsedMessage;
    const { message } = parsedMessage;
    const { argument } = parsedMessage;
    const { userEmail } = parsedMessage;
    const vGroupID = parsedMessage.vgroupid;
    const { convoType } = parsedMessage;
    let personalVGroupID = '';

    if (convoType === 'personal') personalVGroupID = vGroupID;

    let user = bot.getUser(userEmail); // Look up user by their wickr email
    if (user === undefined) { // Check if a user exists in the database
      wickrUser = new WickrUser(userEmail, {
        index: 0,
        personalVGroupID,
        command: '',
        argument: '',
      });
      user = bot.addUser(wickrUser); // Add a new user to the database
      logger.debug('Added user:', user);
      user.token = 'example_token_A1234';
      logger.debug(bot.getUser(userEmail)); // Print the changed user object
    }

    if (!parsedMessage.isAdmin) {
      const reply = `${userEmail} is not authorized to use this bot. If you have a question, please get a hold of us a support@wickr.com or visit us a support.wickr.com. Thanks, Team Wickr`;
      const sMessage = cmdSendRoomMessage(vGroupID, reply);
      logger.debug({ sMessage });
      // writer.writeFile(message);
      return;
    }

    const messageService = new MessageService(
      message,
      userEmail,
      argument,
      command,
      currentState,
      vGroupID,
      user,
    );
    const obj = factory.execute(messageService);
    logger.debug('Object reply:', obj.reply);
    if (obj.reply) {
      logger.debug('Object has a reply');
      const sMessage = cmdSendRoomMessage(vGroupID, obj.reply);
    }
    currentState = obj.state;
  } catch (err) {
    logger.error(err);
  }
}

main();
