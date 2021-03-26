import WickrIOAPI from 'wickrio_addon'

class APIService {
  static sendRoomMessage(vGroupID, message) {
    return WickrIOAPI.cmdSendRoomMessage(vGroupID, message)
  }

  static sendRoomAttachment(vGroupID, attachment, display) {
    return WickrIOAPI.cmdSendRoomAttachment(vGroupID, attachment, display)
  }

  static send1to1Message(userArray, reply, ttl, bor, messageID) {
    return WickrIOAPI.cmdSend1to1Message(userArray, reply, ttl, bor, messageID)
  }

  static send1to1MessageLowPriority(
    userArray,
    reply,
    ttl,
    bor,
    messageID,
    flags
  ) {
    return WickrIOAPI.cmdSend1to1Message(
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

  static getUserInfo(users) {
    const userInfoData = WickrIOAPI.cmdGetUserInfo(users)
    const temp = JSON.parse(userInfoData)
    return temp
  }

  static addRoom(users, moderators, title, description) {
    return WickrIOAPI.cmdAddRoom(users, moderators, title, description)
  }
}

export default APIService
