import State from '../state'
import pkgjson from '../../package.json'
import addonpjson from '../../node_modules/wickrio_addon/package.json'
import botapipjson from '../../node_modules/wickrio-bot-api/package.json'
import fs from 'fs'

class Version {
  static shouldExecute(messageService) {
    if (messageService.getCommand() === '/version') {
      return true
    }
    return false
  }

  static execute() {
    let reply = `*Versions*\nIntegration: ${pkgjson.version}\nWickrIO Addon: ${addonpjson.version}\nWickrIO API: ${botapipjson.version}`

    const dockerInfoFile = '/usr/lib/wickr/docker_info.json'
    if (fs.existsSync(dockerInfoFile)) {
      const dockerinfo = JSON.parse(fs.readFileSync(dockerInfoFile, 'utf-8'))
      const imagetag = dockerinfo.tag

      if (imagetag) {
        reply += `\nDocker Tag: ${imagetag}`
      }
    }

    return {
      reply,
      state: State.NONE,
    }
  }
}

export default Version
