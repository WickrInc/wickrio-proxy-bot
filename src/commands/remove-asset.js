import State from '../state'

// TODO use this instead of putting it in main!
class RemoveAsset {
  constructor(proxyService) {
    this.proxyService = proxyService
    this.commandString = '/delete'
  }

  shouldExecute(messageService) {
    if (messageService.getCommand() === this.commandString) {
      return true
    }
    return false
  }

  execute(messageService) {
    const asset = messageService.getArgument()
    let reply = ''
    if (asset === undefined || asset === '' || asset.split(' ').length !== 1) {
      reply = 'Command contains no asset to delete, usage: /delete <username>'
    } else {
      if (!this.proxyService.removeAsset(asset)) {
        reply = `Failed to delete asset, current list of assets does not contain:${asset}`
      } else {
        reply = `Successfully deleted ${asset} from list of assets`
      }
    }
    return {
      reply,
      state: State.NONE,
    }
  }
}

export default RemoveAsset
