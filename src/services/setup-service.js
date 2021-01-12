// import APIService from './api-service'

class SetupService {
  constructor(dataStorage) {
    this.dataStorage = dataStorage
    this.admins = dataStorage.readCredentials().admins
  }

  saveData() {
    this.dataStorage.saveData({ admins: this.admins })
  }

  alreadySetup(userEmail) {
    return this.admins[userEmail]
  }

  setupComplete(userEmail) {
    this.admins[userEmail] = true
    this.saveData()
  }
}

export default SetupService
