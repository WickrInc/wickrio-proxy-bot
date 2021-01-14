import APIService from './api-service'
import Proxy from '../proxy'
import Asset from '../asset'

class ProxyService {
  constructor(dataStorage, roomService) {
    this.dataStorage = dataStorage
    this.roomService = roomService
    this.members = []
    this.assets = []

    const data = this.dataStorage.readCredentials()
    if (data.members !== undefined && data.members.length !== 0) {
      data.members.forEach(member => {
        this.members.push(new Proxy(member.userID, member.proxyID))
      })
    }
    if (data.assets !== undefined && data.assets.length !== 0) {
      data.assets.forEach(asset => {
        this.assets.push(new Asset(asset.asset, asset.vGroupID))
      })
    }
    console.log(this.members, this.assets)
  }

  getMembers() {
    return this.members
  }

  getAssets() {
    return this.assets
  }

  addAsset(asset) {
    const index = this.assets.findIndex(user => user.getAsset() === asset)
    if (index < 0) {
      this.assets.push(new Asset(asset, ''))
      this.saveData()
      return true
    }
    return false
  }

  addMember(userID, proxyID) {
    const member = this.findUserByID(userID)
    // if we find the user
    member
      ? // change the proxy for the user
        this.members
          .find(user => user.getUserID() === userID)
          .setProxyID(proxyID)
      : // if not, add the new user
        this.members.push(new Proxy(userID, proxyID))
    this.saveData()
  }

  removeMember(userID) {
    const index = this.members.findIndex(user => user.getUserID() === userID)
    if (index < 0) {
      return false
    }
    this.members.splice(index, 1)
    this.saveData()
    return true
  }

  removeAsset(userID) {
    const index = this.assets.findIndex(user => user.getAsset() === userID)
    console.log('INDEX = ', index)
    if (index < 0) {
      return false
    }
    this.assets.splice(index, 1)
    this.saveData()
    return true
  }

  saveData() {
    this.dataStorage.saveData({ members: this.members, assets: this.assets })
  }

  findUserByID(userID) {
    return this.members.find(user => user.getUserID() === userID)
  }

  findAssetByID(asset) {
    return this.assets.find(user => user.getAsset() === asset)
  }

  getProxyID(userID) {
    const user = this.findUserByID(userID)
    if (user) {
      const { proxyID } = user
      return proxyID
    }
  }

  setVGroupID(asset, vGroupID) {
    this.assets.find(user => user.getAsset() === asset).setVGroupID(vGroupID)
    this.saveData()
  }

  sendMessage(userID, message, asset) {
    const proxy = this.getProxyID(userID)
    const messageString = `Message from ${proxy}:\n${message}`
    const assetArray = [asset]
    APIService.send1to1Message(assetArray, messageString, '', '', '')
    this.message = ''
  }

  replyMessage(userID, message) {
    const vGroupID = this.assets
      .find(user => user.getAsset() === userID)
      .getVGroupID()
    // const memberArray = []
    // this.members.forEach(member => {
    //   memberArray.push(member.getUserID())
    // })
    // vGroupID
    //   ? APIService.sendRoomMessage(vGroupID, message)
    //   : APIService.send1to1Message(memberArray, message, '', '', '')
    if (vGroupID) {
      return APIService.sendRoomMessage(vGroupID, message)
    }
    return false
  }

  createRoom(asset) {
    // TODO change copy!
    const description = 'To send a message to the asset: /send <message>'
    let reply = 'This is a conversation with:'
    this.members.forEach(member => {
      reply += `\n${member.userID}, ${member.proxyID}`
    })
    reply +=
      '\nYour email address and anything you say here (including messages from the ProxyBot) is not visible to the asset. To communicate with the asset, start your message with /send'
    reply += `To send a message to ${asset} use /send <message>`
    const title = `Conversation with ${asset}`
    const users = []
    this.members.forEach(user => {
      users.push(user.getUserID())
    })
    const uMessage = APIService.addRoom(
      users,
      users,
      title,
      description,
      '',
      ''
    )
    const vGroupID = JSON.parse(uMessage).vgroupid
    this.setVGroupID(asset, vGroupID)
    APIService.sendRoomMessage(vGroupID, reply)
    return title
  }

  isAssetRoom(vGroupID) {
    return this.assets.find(user => user.getVGroupID() === vGroupID)
  }

  isAsset(userEmail) {
    return this.assets.find(user => user.getAsset() === userEmail)
  }
}

export default ProxyService
