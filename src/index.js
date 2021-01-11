import * as WickrIOBotAPI from 'wickrio-bot-api'
import MessageService from './services/message-service'
import Factory from './factory'
import logger from './logger'
// import MemberListRepo from './helpers/member-list'
import ProxyService from './services/proxy-service'
import JSONCredentialsHandler from './helpers/json-credentials-handler'
import State from './state'
import pkgjson from '../package.json'
import APIService from './services/api-service'
import SetupService from './services/setup-service'

// const memberListRepo = new MemberListRepo(fs)
// const factory = new Factory(memberListRepo)
const defaultData = {
  members: [],
  assets: [],
}

const jsonCredentialsHandler = new JSONCredentialsHandler(
  defaultData,
  './credentials.json'
)

const proxyService = new ProxyService(jsonCredentialsHandler)
const factory = new Factory(proxyService)
const WickrUser = WickrIOBotAPI.WickrUser
const bot = new WickrIOBotAPI.WickrIOBot()
const WickrIOAPI = bot.getWickrIOAddon()

let currentState
// const setupComplete = false

process.stdin.resume() // so the program will not close instantly

async function exitHandler(options, err) {
  try {
    await bot.close()
    if (err || options.exit) {
      logger.error('Exit reason:', err)
      process.exit()
    } else if (options.pid) {
      process.kill(process.pid)
    }
  } catch (err) {
    logger.error(err)
  }
}

// catches ctrl+c and stop.sh events
process.on('SIGINT', exitHandler.bind(null, { exit: true }))
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { pid: true }))
process.on('SIGUSR2', exitHandler.bind(null, { pid: true }))
// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }))

async function main() {
  // logger.debug('Entering main!');
  try {
    const tokens = JSON.parse(process.env.tokens)
    let status
    if (process.argv[2] === undefined) {
      status = await bot.start(tokens.WICKRIO_BOT_NAME.value)
    } else {
      status = await bot.start(process.argv[2])
    }
    if (!status) {
      exitHandler(null, {
        exit: true,
        reason: 'Client not able to start',
      })
    }
    const adminList = bot.getAdmins()
    const setupData = { admins: {} }
    for (const admin of adminList) {
      console.log('admin' + admin)
      setupData.admins[admin] = false
    }

    const setupHandler = new JSONCredentialsHandler(
      setupData,
      './setupData.json'
    )

    this.setupService = new SetupService(setupHandler)
    const setupAdmins = []
    for (const admin of bot.getAdmins()) {
      if (!this.setupService.alreadySetup(admin)) {
        setupAdmins.push(admin)
      }
    }

    let welcomeMessage = `Welcome to the Wickr ProxyBot (version ${pkgjson.version}) has started.\n`
    welcomeMessage +=
      'Setup Wizard Started\nStart by adding aliases to users one user at a time using: <username> <alias>'
    APIService.send1to1Message(setupAdmins, welcomeMessage, '', '', '')

    await bot.startListening(listen) // Passes a callback function that will receive incoming messages into the bot client
    // /////////////////////
    // Start coding below and modify the listen function to your needs
    // /////////////////////
  } catch (err) {
    logger.error(err)
  }
}

function listen(incomingMessage) {
  try {
    // Parses an incoming message and returns and object with command, argument,
    // vGroupID and Sender fields
    const parsedMessage = bot.parseMessage(incomingMessage)
    if (!parsedMessage) {
      return
    }
    logger.debug('New incoming Message:', parsedMessage)
    let wickrUser
    // TODO is this ok formatting??
    // combine all into one line
    const { command } = parsedMessage
    const { message } = parsedMessage
    const { argument } = parsedMessage
    const { userEmail } = parsedMessage
    const vGroupID = parsedMessage.vgroupid
    const { convoType } = parsedMessage
    const { isAdmin } = parsedMessage
    let personalVGroupID = ''
    if (convoType === 'personal') personalVGroupID = vGroupID

    let user = bot.getUser(userEmail) // Look up user by their wickr email
    if (user === undefined) {
      // Check if a user exists in the database
      wickrUser = new WickrUser(userEmail, {
        index: 0,
        personalVGroupID,
        command: '',
        argument: '',
        currentState,
      })
      user = bot.addUser(wickrUser) // Add a new user to the database
      logger.debug('Added user:', user)
      user.token = 'example_token_A1234'
      logger.debug(bot.getUser(userEmail)) // Print the changed user object
    }

    // TODO add message type here
    const messageService = new MessageService(
      message,
      userEmail,
      argument,
      command,
      user.currentState,
      vGroupID,
      user,
      isAdmin
    )
    if (isAdmin && !this.setupService.alreadySetup(userEmail)) {
      user.currentState = State.SETUP_ALIAS
      this.setupService.setupComplete(userEmail)
    }

    const returnObj = factory.executeCommands(messageService)

    logger.debug('Object reply:', returnObj.reply)
    if (returnObj.reply) {
      WickrIOAPI.cmdSendRoomMessage(vGroupID, returnObj.reply)
    }
    user.currentState = returnObj.state
  } catch (err) {
    logger.error(err)
  }
}

main()
