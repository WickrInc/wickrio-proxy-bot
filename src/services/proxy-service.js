import fs from 'fs'
import logger from '../logger'
import APIService from './api-service'

// read or create credentials.json
const credentialFile = './credentials.json'

class ProxyService {
  constructor() {
    const credentialData = this.readCredentialFile()
    this.members = []
    this.assets = []
    if (credentialData.members) {
      this.members = credentialData.members
    }
    if (credentialData.assets) {
      this.assets = credentialData.assets
    }
    console.log(this.members, this.assets)
  }

  getMembers() {
    return this.members
  }

  getAssets() {
    return this.assets
  }

  setAndSaveAsset(asset) {
    this.asset.push(asset)
    const writeObject = {
      members: this.members,
      assets: this.assets,
    }

    fs.writeFile(credentialFile, JSON.stringify(writeObject), err => {
      if (err) return console.log(err)
      logger.trace('Current asset saved in file')
    })
  }

  readCredentialFile = () => {
    const defaultData = {
      members: [],
      assets: [],
    }

    // TODO improve this!
    // if (!fs.existsSync('credentials.json')) {
    if (!fs.existsSync(credentialFile)) {
      fs.writeFile(credentialFile, JSON.stringify(defaultData), err => {
        if (err) logger.error({ err })
        console.log('creating credenitals.json')
      })
      return defaultData
    }

    // TODO this needs to be fixed!
    const rawcreds = fs.readFileSync(credentialFile, (err, data) => {
      if (err) {
        console.log({ err })
        // logger.debug('Got here')
        // fs.writeFile('credentials.json', JSON.stringify(defaultData), err => {
        //   if (err) logger.error({ err })
        //   logger.debug('new file')
        //   return defaultData
        // })
      } else if (data) {
        return data
      }
    })
    const parsedCreds = JSON.parse(rawcreds)
    return parsedCreds
  }

  findUserByID(userID) {
    const findUserByID = this.members.find(
      usercredential => usercredential.userID === userID
    )
    return findUserByID
  }

  removeMember(userID) {
    const index = this.members.findIndex(user => user.userID === userID)
    if (index < 0) {
      return false
    }
    this.members.splice(index, 1)
    return true
  }

  removeAsset(userID) {
    const index = this.assets.findIndex(user => user.asset === userID)
    if (index < 0) {
      return false
    }
    this.asset.splice(index, 1)
    return true
  }

  getProxyID(userID) {
    const user = this.findUserByID(userID)
    if (user) {
      const { proxyID } = user
      return proxyID
    }
  }

  addMember(userID, proxyID) {
    const member = this.findUserByID(userID)
    const userCredentials = {
      userID: userID,
      proxyID: proxyID,
    }

    // if we find the user
    member
      ? // change the proxy for the user
        (this.members.find(user => user.userID === userID).proxyID = proxyID)
      : // if not, add the user and proxy
        this.members.push(userCredentials)

    const writeObject = {
      members: this.members,
      asset: this.asset,
    }

    // TODO make writing to the file a function?? or helper!
    fs.writeFile(credentialFile, JSON.stringify(writeObject), err => {
      if (err) return console.log(err)
      logger.trace('Current asset saved in file')
    })
    return userCredentials.proxyID.toString()
  }

  getUser(userID) {
    const user = this.members.find(
      usercredential => usercredential.userID === userID
    )

    return `${user.userID}: ${user.proxyID}`
  }

  sendMessage(userID, message) {
    const proxy = this.findUserByID(userID)
    const messageString = `Message from ${proxy}:\n${message}`
    const assetArray = [this.asset]
    APIService.send1to1Message(assetArray, messageString, '', '', '')
  }
}

export default ProxyService
