import fs from 'fs'
import logger from '../logger'
import * as WickrIOBotAPI from 'wickrio-bot-api'
const bot = new WickrIOBotAPI.WickrIOBot()
const WickrIOAPI = bot.getWickrIOAddon()

class ProxyService {
  constructor() {
    this.allMembers = this.readCredentialFile()
  }

  readCredentialFile() {
    const defaultdata = {
      credentials: [],
    }
    const creds = fs.readFile('credentials.json', (err, data) => {
      if (err) {
        fs.writeFile('credentials.json', JSON.stringify(defaultdata), err => {
          if (err) console.log({ err })
          logger.trace('Current alias saved in file')
        })
      } else if (data) {
        console.log({ data })
        return data
      }
    })
    return creds
  }

  static findUserByProxy(proxyid) {
    const findUserByProxy = this.allMembers.credentials.find(
      usercredential => usercredential.proxyid === proxyid
    )
    return findUserByProxy
  }

  static findUserByID(userid) {
    const findUserByID = this.allMembers.credentials.find(
      usercredential => usercredential.userid === userid
    )
    return findUserByID
  }

  static getUserID(proxyid) {
    const user = this.findUserByProxy(proxyid)
    if (user) {
      const { userid } = user
      return userid
    }
  }

  static getProxyID(userid) {
    const user = this.findUserByID(userid)
    if (user) {
      const { proxyid } = user
      return proxyid
    }
  }

  static addProxyID(userid, proxyid) {
    const user = this.findUserByID(userid)
    const userCredentials = {
      userid: userid,
      proxyid: proxyid,
    }
    // if we find the user
    user
      ? // add proxy to the cedentials
        this.allMembers.credentials
          .find(usercredential => usercredential.userid === userid)
          .proxyid.append(proxyid)
      : // if not, add the user and proxy
        this.allMembers.credentials.append(userCredentials)

    fs.writeFile('credentials.json', this.allMembers, err => {
      if (err) return console.log(err)
      logger.trace('Current alias saved in file')
    })
    return userCredentials.proxyid.toString()
  }

  static getUser(userid) {
    const user = this.allMembers.credentials.find(
      usercredential => usercredential.userid === userid
    )

    return `${user.userid}: ${user.proxyid}`
  }

  static getMemberList() {
    const description = `Conversation with ${this.alias.alias}`
    const title = `Conversation with ${this.alias.alias}`

    console.log({ description, title })
  }

  static createRoom() {
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

  static sendMessage(message) {
    const messageString = `Message from ${this.members[0].alias}:\n${message}`
    const aliasArray = []
    aliasArray.push(this.alias.userID)
    WickrIOAPI.cmdSend1to1Message(aliasArray, messageString, '', '', '')
  }
}
const service = new ProxyService()
console.log(service.allMembers)

export default ProxyService
