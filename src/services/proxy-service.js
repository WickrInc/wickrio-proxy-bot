import fs from 'fs'
import logger from '../logger'
import * as WickrIOBotAPI from 'wickrio-bot-api'
const bot = new WickrIOBotAPI.WickrIOBot()
const WickrIOAPI = bot.getWickrIOAddon()

class ProxyService {
  constructor() {
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

  getAsset() {
    return this.asset
  }

  readCredentialFile() {
    const defaultData = {
      members: [],
      asset: '',
    }
    const creds = fs.readFile('credentials.json', (err, data) => {
      if (err) {
        logger.debug('Got here')
        fs.writeFile('credentials.json', JSON.stringify(defaultData), err => {
          if (err) logger.error({ err })
          logger.debug('Current alias saved in file')
          return defaultData
        })
      } else if (data) {
        logger.debug('Got here instead')
        logger.debug({ data })
        return data
      }
    })
    logger.debug(creds)
    return creds
  }

  findUserByProxy(proxyid) {
    const findUserByProxy = this.members.find(
      usercredential => usercredential.proxyid === proxyid
    )
    return findUserByProxy
  }

  findUserByID(userid) {
    const findUserByID = this.members.find(
      usercredential => usercredential.userid === userid
    )
    return findUserByID
  }

  // TODO should members be able to have the same proxy?
  getUserID(proxyid) {
    const user = this.findUserByProxy(proxyid)
    if (user) {
      const { userid } = user
      return userid
    }
  }

  getProxyID(userid) {
    const user = this.findUserByID(userid)
    if (user) {
      const { proxyid } = user
      return proxyid
    }
  }

  addProxyID(userid, proxyid) {
    const user = this.findUserByID(userid)
    const userCredentials = {
      userid: userid,
      proxyid: proxyid,
    }

    // if we find the user
    user
      ? // add proxy to the cedentials
        (this.members.find(
          usercredential => usercredential.userid === userid
        ).proxyid = proxyid)
      : // if not, add the user and proxy
        this.members.append(userCredentials)

    const writeObject = {
      members: this.members,
      asset: this.asset,
    }

    fs.writeFile('credentials.json', writeObject, err => {
      if (err) return console.log(err)
      logger.trace('Current alias saved in file')
    })
    return userCredentials.proxyid.toString()
  }

  getUser(userid) {
    const user = this.members.find(
      usercredential => usercredential.userid === userid
    )

    return `${user.userid}: ${user.proxyid}`
  }

  getMemberList() {
    const description = `Conversation with ${this.alias.alias}`
    const title = `Conversation with ${this.alias.alias}`

    console.log({ description, title })
  }

  createRoom() {
    let reply = 'Room created.'
    if (this.members === undefined || this.members.length === 0) {
      reply = 'Alias contains no members'
    } else if (this.alias === undefined || this.alias === '') {
      reply = 'No alias to send to set and alias with /alias'
    } else {
      const description = `Conversation with ${this.alias.alias}`
      const title = `Conversation with ${this.alias.alias}`
      const usernames = []
      for (const member of this.members) {
        usernames.push(member.userID)
      }
      // usernames.push() bot name!
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

      WickrIOAPI.cmdLeaveRoom(this.vGroupID)
    }
    return reply
  }

  sendMessage(message) {
    const messageString = `Message from ${this.members[0].alias}:\n${message}`
    const aliasArray = []
    aliasArray.push(this.alias.userID)
    WickrIOAPI.cmdSend1to1Message(aliasArray, messageString, '', '', '')
  }
}

export default ProxyService
