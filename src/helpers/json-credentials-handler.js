import fs from 'fs'
import logger from '../logger'

// TODO make all this static??
class JSONCredentialsHandler {
  readCredentials = (defaultData, credentialFile) => {
    // TODO improve this!
    // './credentials.json' = credentialFile
    if (!fs.existsSync('./credentials.json')) {
      fs.writeFile('./credentials.json', JSON.stringify(defaultData), err => {
        if (err) logger.error({ err })
        logger.trace('creating credenitals.json')
      })
      return defaultData
    }
    const rawcreds = fs.readFileSync('./credentials.json', (err, data) => {
      if (err) {
        console.log({ err })
      } else if (data) {
        return data
      }
    })
    const parsedCreds = JSON.parse(rawcreds)
    return parsedCreds
  }

  saveData(writeObject) {
    fs.writeFile('./credentials.json', JSON.stringify(writeObject), err => {
      if (err) return console.log(err)
      logger.trace('Current data saved in file')
    })
  }
}

export default JSONCredentialsHandler
