import APIService from './api-service'
import Proxy from '../proxy'
import Asset from '../asset'
import State from '../state'

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

  async sendMessage(userID, message, asset) {
    const proxy = this.getProxyID(userID)
    const messageString = `Message from ${proxy}:\n${message}`
    const assetArray = [asset]
    await APIService.send1to1Message(assetArray, messageString, '', '', '')
    this.message = ''
  }

  async replyMessage(userID, message) {
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
      return await APIService.sendRoomMessage(vGroupID, message)
    }
    return false
  }

  async createRoom(asset) {
    // TODO change copy!
    const description = 'To send a message to the asset: /send <message>'
    let reply = 'This is a conversation with:\n'
    this.members.forEach(member => {
      reply += `${member.userID}, ${member.proxyID}\n`
    })
    reply += `Your email address and anything you say here (including messages from the ProxyBot) are not visible to the asset. To communicate with the asset, start your message with /send\nTo send a message to ${asset} use /send <message>`
    const title = `Conversation with ${asset}`
    const users = []
    this.members.forEach(user => {
      users.push(user.getUserID())
    })
    const uMessage = await APIService.addRoom(
      users,
      users,
      title,
      description,
      '',
      ''
    )
    const vGroupID = JSON.parse(uMessage).vgroupid
    this.setVGroupID(asset, vGroupID)
    await APIService.sendRoomMessage(vGroupID, reply)
    return title
  }

  setupCreateRoom() {
    let reply
    let state = State.NONE
    if (this.members === undefined || this.members.length === 0) {
      reply =
        'You must have at least one Alias member before you can create a room. Add an alias using <user@email> <alias>.'
      state = State.SETUP_ALIAS
    } else if (this.assets === undefined || this.assets.length === 0) {
      reply =
        'You must have at least one Asset before you can create a room. Add an asset using /asset <username>.'
      state = State.SETUP_ASSET
    } else if (this.assets.length === 1) {
      // const title = this.proxyService.createRoom(this.assets[0].getAsset())
      reply = `Step 3 of 4: Asset creation is now complete! Would you like to create a room with this asset (${this.assets[0].asset}? (Yes/No)`
      state = State.CREATE_ROOM_SETUP
    } else {
      let i = 1
      reply =
        'Step 3 of 4: Asset creation is now complete! Which asset would you like to create a room with?'
      this.assets.forEach(asset => {
        reply += `\n${i}: ${asset.asset}`
        i += 1
      })
      state = State.WHICH_ROOM_SETUP
    }
    return {
      reply,
      state,
    }
  }

  isAssetRoom(vGroupID) {
    return this.assets.find(user => user.getVGroupID() === vGroupID)
  }

  isAsset(userEmail) {
    return this.assets.find(user => user.getAsset() === userEmail)
  }
}

export default ProxyService
