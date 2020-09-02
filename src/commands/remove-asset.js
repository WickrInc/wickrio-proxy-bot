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
    // const members = messageService.getArgument().split(' ')
    const asset = messageService.getArgument()
    let reply = ''
    if (asset === undefined || asset === '') {
      reply = 'Command contains no asset to delete, usage: /delete <username>'
    } else {
      if (!this.proxyService.removeAsset(asset)) {
        reply = `Failed to delete asset, current list of assets does not contain:${asset}`
      } else {
        reply = `Successfully deleted ${asset} from list of assets`
      }
    }
    // if (members === undefined || members.length === 0) {
    //   reply = 'Command contains no asset to remove, usage: /delete <username>'
    // } else {
    //   const removeFails = []
    //   for (let i = 0; i < members.length; i++) {
    //     if (!this.proxyService.removeAsset(members[i])) {
    //       removeFails.push(members.splice(i, 1))
    //       i--
    //     }
    //   }
    //   if (removeFails.length >= 1) {
    //     reply =
    //       'Failed to remove member(s), current list of members does not contain:\n'
    //     reply += removeFails.join('\n')
    //     if (members.length >= 1) {
    //       reply += '\n'
    //     }
    //   }

    //   if (members.length >= 1) {
    //     reply += 'Successfully removed the following users:\n'
    //     reply += members.join('\n')
    //   }
    // }
    return {
      reply,
      state: State.NONE,
    }
  }
}

export default RemoveAsset
