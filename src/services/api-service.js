import WickrIOAPI from 'wickrio_addon'

class APIService {
  static async sendRoomMessage(vGroupID, message) {
    return await WickrIOAPI.cmdSendRoomMessage(vGroupID, message)
  }

  static async sendRoomAttachment(vGroupID, attachment, display) {
    return await WickrIOAPI.cmdSendRoomAttachment(vGroupID, attachment, display)
  }

  static async send1to1Message(userArray, reply, ttl, bor, messageID) {
    return await WickrIOAPI.cmdSend1to1Message(
      userArray,
      reply,
      ttl,
      bor,
      messageID
    )
  }

  static async send1to1MessageLowPriority(
    userArray,
    reply,
    ttl,
    bor,
    messageID,
    flags
  ) {
    return await WickrIOAPI.cmdSend1to1Message(
      userArray,
      reply,
      ttl,
      bor,
      messageID,
      flags,
      '',
      true
    )
  }

  static async getUserInfo(users) {
    const userInfoData = await WickrIOAPI.cmdGetUserInfo(users)
    const temp = JSON.parse(userInfoData)
    return temp
  }

  static async addRoom(users, moderators, title, description) {
    return await WickrIOAPI.cmdAddRoom(users, moderators, title, description)
  }
}

export default APIService
