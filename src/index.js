import path from 'path'
import fs from 'fs'
import * as WickrIOBotAPI from 'wickrio-bot-api'
import Factory from './factory'
import logger from './helpers/logger'
import ProxyService from './services/proxy-service'
import JSONCredentialsHandler from './helpers/json-credentials-handler'
import State from './state'
import pkgjson from '../package.json'
import APIService from './services/api-service'
import SetupService from './services/setup-service'

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
const bot = new WickrIOBotAPI.WickrIOBot()
const WickrIOAPI = bot.getWickrIOAddon()
let setupService

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
  try {
    // Read in the processes.json file
    const processesJsonFile = path.join(process.cwd(), 'processes.json')
    if (!fs.existsSync(processesJsonFile)) {
      console.error(processesJsonFile + ' does not exist!')
      process.exit(1)
    }
    const processesJson = fs.readFileSync(processesJsonFile)
    // console.log('processes.json=' + processesJson)
    const processesJsonObject = JSON.parse(processesJson)

    process.env.tokens = JSON.stringify(processesJsonObject.apps[0].env.tokens)
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

    bot.setAdminOnly(false)

    const { VERIFY_USERS } = tokens

    // set the verification mode to true
    let verifyUsersMode
    if (VERIFY_USERS.encrypted) {
      verifyUsersMode = WickrIOAPI.cmdDecryptString(VERIFY_USERS.value)
    } else {
      verifyUsersMode = VERIFY_USERS.value
    }

    bot.setVerificationMode(verifyUsersMode)

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

    setupService = new SetupService(setupHandler)
    const setupAdmins = []
    for (const admin of bot.getAdmins()) {
      if (!setupService.alreadySetup(admin)) {
        setupAdmins.push(admin)
      }
    }

    const welcomeMessage = `Welcome to the Wickr ProxyBot (version ${pkgjson.version}). Follow the 4-step guide or type /cancel to exit and configure your users manually.\n\nStep 1 of 4: Create an alias for yourself or your teammate one user at a time in the format <user@email.com> <alias>`
    console.log('sending welcome to ' + setupAdmins)
    if (setupAdmins.length > 0) {
      APIService.send1to1Message(setupAdmins, welcomeMessage, '', '', '')
    }

    await bot.startListening(listen) // Passes a callback function that will receive incoming messages into the bot client
    // /////////////////////
    // Start coding below and modify the listen function to your needs
    // /////////////////////
  } catch (err) {
    logger.error(err)
  }
}

function listen(rawMessage) {
  try {
    const messageService = bot.messageService({ rawMessage })
    const { isAdmin, vGroupID, msgType, user, userEmail } = messageService

    if (msgType !== 'file' && msgType !== undefined) {
      return
    }

    if (isAdmin && !setupService.alreadySetup(userEmail)) {
      console.log('isAdmin and not already setup')
      user.currentState = State.SETUP_ALIAS
      setupService.setupComplete(userEmail)
    }

    const returnObj = factory.executeCommands(messageService)
    if (returnObj) {
      if (returnObj.reply) {
        logger.debug('Object reply:', returnObj.reply)
        WickrIOAPI.cmdSendRoomMessage(vGroupID, returnObj.reply)
      }
      user.currentState = returnObj.state
    }
  } catch (err) {
    logger.error(err)
  }
}

main()
