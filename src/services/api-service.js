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
    const buttons = []
    return WickrIOAPI.cmdSend1to1Message(
      userArray,
      reply,
      ttl,
      bor,
      messageID,
      flags,
      buttons,
      true
    )
  }

  static getUserInfo(users) {
    return WickrIOAPI.cmdGetUserInfo(users)
  }
}

export default APIService
