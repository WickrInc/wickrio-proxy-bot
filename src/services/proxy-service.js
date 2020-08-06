import fs from 'fs'
import logger from '../logger'
import * as WickrIOBotAPI from 'wickrio-bot-api'
const bot = new WickrIOBotAPI.WickrIOBot()
const WickrIOAPI = bot.getWickrIOAddon()

class ProxyService {
  constructor() {
    this.credentialFile = 'credentials.json'
    const credentialData = this.readCredentialFile()
    logger.debug(`credential data ${credentialData}`)
    this.member = []
    this.asset = ''
    if (credentialData.members) {
      this.members = credentialData.members
    }
    if (credentialData.asset) {
      this.asset = credentialData.asset
    }
  }

  getMembers() {
    return this.members
  }

  setAndSaveAsset(asset) {
    this.asset = asset
    const writeObject = {
      members: this.members,
      asset: this.asset,
    }

    fs.writeFile(this.credentialFile, JSON.stringify(writeObject), err => {
      if (err) return console.log(err)
      logger.trace('Current asset saved in file')
    })
  }

  getAsset() {
    return this.asset
  }

  readCredentialFile() {
    const defaultData = {
      members: [],
      asset: '',
    }
    // TODO improve this!
    // if (!fs.existsSync(this.credentialFile)) {
    if (!fs.existsSync('dne.txt')) {
      fs.writeFile(this.credentialFile, JSON.stringify(defaultData), err => {
        if (err) logger.error({ err })
        logger.debug('Current asset saved in file')
      })
      return defaultData
    }
    // TODO this needs to be fixed!

    const creds = fs.readFile(this.credentialFile, (err, data) => {
      if (err) {
        logger.debug('Got here')
        fs.writeFile(this.credentialFile, JSON.stringify(defaultData), err => {
          if (err) logger.error({ err })
          logger.debug('Current asset saved in file')
          return defaultData
        })
      } else if (data) {
        logger.debug('Got here instead')
        logger.debug({ data })
        return data
      }
    })
    logger.debug('Got nowhere' + creds)
    return creds
  }

  // TODO what's the difference between find and get? return value?
  findUserByProxy(proxyID) {
    const findUserByProxy = this.members.find(
      usercredential => usercredential.proxyID === proxyID
    )
    return findUserByProxy
  }

  findUserByID(userID) {
    const findUserByID = this.members.find(
      usercredential => usercredential.userID === userID
    )
    return findUserByID
  }

  removeMember(userID) {
    const index = this.members.findIndex(user => user.userID === userID)
    if (index < 0) {
      return false
    }
    this.members.splice(index, 1)
    return true
  }

  // TODO should members be able to have the same proxy?
  getUserID(proxyID) {
    const user = this.findUserByProxy(proxyID)
    if (user) {
      const { userID } = user
      return userID
    }
  }

  getProxyID(userID) {
    const user = this.findUserByID(userID)
    if (user) {
      const { proxyID } = user
      return proxyID
    }
  }

  addProxyID(userID, proxyID) {
    const user = this.findUserByID(userID)
    const userCredentials = {
      userID: userID,
      proxyID: proxyID,
    }

    // if we find the user
    user
      ? // add proxy to the cedentials
        (this.members.find(
          usercredential => usercredential.userID === userID
        ).proxyID = proxyID)
      : // if not, add the user and proxy
        this.members.push(userCredentials)

    const writeObject = {
      members: this.members,
      asset: this.asset,
    }

    // TODO make writing to the file a function?? or helper!
    fs.writeFile(this.credentialFile, JSON.stringify(writeObject), err => {
      if (err) return console.log(err)
      logger.trace('Current asset saved in file')
    })
    return userCredentials.proxyID.toString()
  }

  getUser(userID) {
    const user = this.members.find(
      usercredential => usercredential.userID === userID
    )

    return `${user.userID}: ${user.proxyID}`
  }

  // TODO most of this should be else where
  createRoom() {
    let reply = 'Room created.'
    if (this.members === undefined || this.members.length === 0) {
      reply = 'asset contains no members'
    } else if (this.asset === undefined || this.asset === '') {
      reply = 'No asset to send to set and asset with /asset'
    } else {
      const description = 'To send a message to the asset: /send <message>'
      const title = `Conversation with ${this.asset.asset}`
      const usernames = []
      for (const member of this.members) {
        usernames.push(member.userID)
      }
      // TODO do we need to usernames.push() bot name?
      const uMessage = WickrIOAPI.cmdAddRoom(
        usernames,
        usernames,
        title,
        description,
        '',
        ''
      )
      this.vGroupID = JSON.parse(uMessage).vgroupid
      logger.debug(`Here is the uMessage${uMessage}`)
      logger.debug(`Here is the vGroupID${this.vGroupID}`)
      WickrIOAPI.cmdSendRoomMessage(this.vGroupID, description)
    }
    return reply
  }

  sendMessage(userID, message) {
    const proxy = this.findUserByID(userID)
    const messageString = `Message from ${proxy}:\n${message}`
    const assetArray = [this.asset]
    WickrIOAPI.cmdSend1to1Message(assetArray, messageString, '', '', '')
  }
}

export default ProxyService
