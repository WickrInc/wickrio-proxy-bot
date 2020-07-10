import fs from 'fs'
import logger from '../logger'
// import * as WickrIOBotAPI from 'wickrio-bot-api'
// const bot = new WickrIOBotAPI.WickrIOBot()
// const WickrIOAPI = bot.getWickrIOAddon()

class ProxyService {
  constructor() {
    this.allMembers = this.readCredentialFile()
  }

  readCredentialFile() {
    // console.log('hello')
    const defaultdata = {
      credentials: [],
    }
    // console.log(JSON.stringify(defaultdata))
    if (fs.existsSync('credentials.json')) {
      // console.log('killme')
      const creds = fs.readFileSync('credentials.json')
      // let data = JSON.parse(creds)
      console.log({ 'type of credentials': typeof creds.credentials })
      return JSON.parse(creds)
    } else {
      fs.writeFileSync('credentials.json', JSON.parse(defaultdata))
      return defaultdata
    }
  }

  findUserByProxy(proxyid) {
    console.log(this.allMembers)
    const findUserByProxy = this.allMembers.credentials.find(
      usercredential => usercredential.proxyid === proxyid
    )
    return findUserByProxy
  }

  findUserByID(userid) {
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

  addProxyID(userid, proxyid) {
    const user = this.findUserByID(userid)
    const userCredentials = {
      userid: userid,
      proxyid: proxyid,
    }
    console.log({ user })
    console.log({ credentials: typeof this.allMembers.credentials })
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
    const agents = this.allMembers.credentials.map(agent => agent.userid)
    console.log({ agents })
    return agents
  }

  // static createRoom() {
  //   let reply = 'Room created.'
  //   if (this.members === undefined || this.members.length === 0) {
  //     reply = 'Alias contains no members'
  //   } else if (this.alias === undefined || this.alias === '') {
  //     reply = 'No alias to send to set and alias with /alias'
  //   } else {
  //     const description = `Conversation with ${this.alias.alias}`
  //     const title = `Conversation with ${this.alias.alias}`
  //     const usernames = []
  //     for (const member of this.members) {
  //       usernames.push(member.userID)
  //     }
  //     // usernames.push() bot name
  //     const uMessage = WickrIOAPI.cmdAddRoom(
  //       usernames,
  //       usernames,
  //       title,
  //       description,
  //       '',
  //       ''
  //     )
  //     this.vGroupID = JSON.parse(uMessage).vgroupid
  //     logger.debug(`Here is the uMessage${uMessage}`)
  //     logger.debug(`Here is the vGroupID${this.vGroupID}`)
  //     WickrIOAPI.cmdSendRoomMessage(this.vGroupID, description)

  //     WickrIOAPI.cmdLeaveRoom(this.vGroupID)
  //   }
  //   return reply
  // }

  // static sendMessage(message) {
  //   const messageString = `Message from ${this.members[0].alias}:\n${message}`
  //   const aliasArray = []
  //   aliasArray.push(this.alias.userID)
  //   WickrIOAPI.cmdSend1to1Message(aliasArray, messageString, '', '', '')
  // }
}

const service = new ProxyService()
service.findUserByProxy('myproxy')
service.addProxyID('me', 'myproxy')
service.addProxyID('you', 'yourproxy')

export default ProxyService
