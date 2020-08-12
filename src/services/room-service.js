import APIService from './api-service'

class RoomService {
  // TODO most of this should be else where
  createRoom(users, asset) {
    let reply = 'Room created.'
    if (users === undefined || users.length === 0) {
      reply = 'No members to create a room'
    } else if (asset === undefined || asset === '') {
      reply = 'No asset to send to set an asset with /asset'
    } else {
      const description = 'To send a message to the asset: /send <message>'
      const title = `Conversation with ${asset}`
      const uMessage = APIService.addRoom(
        users,
        users,
        title,
        description,
        '',
        ''
      )
      this.vGroupID = JSON.parse(uMessage).vgroupid
      APIService.sendRoomMessage(this.vGroupID, description)
    }
    return reply
  }
}

export default RoomService
