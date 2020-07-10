import * as WickrIOBotAPI from 'wickrio-bot-api'
import logger from '../logger'

const bot = new WickrIOBotAPI.WickrIOBot()
const WickrIOAPI = bot.getWickrIOAddon()

class MemberListRepo {
  // constructor(fs){
  constructor(fs) {
    this.fs = fs
    let memberData
    let aliasData
    try {
      if (fs.existsSync('./files/members.json')) {
        memberData = fs.readFileSync('./files/members.json')
        if (!memberData) {
          // logger.error('Error reading members.json!');
          return
        }
        this.members = JSON.parse(memberData)
        // this.members = pjson.value;
        logger.debug(`Members is:${this.members}`)
      } else {
        this.members = []
        // this.updateMemberList(this.members);
      }
      if (fs.existsSync('./files/alias.json')) {
        aliasData = fs.readFileSync('./files/alias.json')
        if (!aliasData) {
          logger.error('Error reading alias.json!')
          return
        }
        this.alias = JSON.parse(aliasData)
      } else {
        this.alias = ''
      }
    } catch (err) {
      // logger.error(err);
    }
  }

  getMemberList() {
    return this.members
  }

  // TODO fix this
  // Make add and remove
  updateMemberList(memberList) {
    this.members = memberList
    try {
      logger.debug(`This is the memberList: ${memberList}`)
      const memberListToWrite = JSON.stringify(memberList)
      if (!this.fs.existsSync('./files')) {
        this.fs.mkdirSync('./files')
      }
      this.fs.writeFile('./files/members.json', memberListToWrite, err => {
        // TODO Fix this
        if (err) throw err
        logger.trace('Current Members saved in file')
      })
      return memberList.toString()
    } catch (err) {
      // logger.error(err);
    }
  }

  setAlias(alias) {
    this.alias = alias
    try {
      const aliasToWrite = JSON.stringify(alias)
      if (!this.fs.existsSync('./files')) {
        this.fs.mkdirSync('./files')
      }
      this.fs.writeFile('./files/alias.json', aliasToWrite, err => {
        // TODO Fix this
        if (err) throw err
        logger.trace('Current alias saved in file')
      })
      return alias.toString()
    } catch (err) {
      logger.error(err)
    }
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
      // WickrIOAPI.cmdLeaveRoom(vGroupID);
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

module.exports = MemberListRepo
