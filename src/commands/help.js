import State from '../state'

class Help {
  static shouldExecute(messageService) {
    if (messageService.getCommand() === '/help') {
      return true
    }
    return false
  }

  static execute() {
    const reply =
      '*Proxy Commands*\n' +
      '/add <member> <alias>: adds member with the given alias to the list of users\n' +
      '/asset <asset-name>: creates an asset that will recieve messages from the /send command\n' +
      '/create : creates a room with the list of users, use the /send command in this room to communicate with the asset\n' +
      '/delete <asset> : deletes the asset from the list of assets\n' +
      '/list : returns the current list of users in the group and the assets available to send to\n' +
      '/remove <members> : removes a whitespace delimited list of users from the group\n' +
      '/send <message> : sends a message to the asset in the form of a one-to-one conversation with the proxy bot, must be sent from the room created with the /create command\n' +
      '\n*Admin Commands*\n' +
      '/admin list : Get list of admin users \n' +
      '/admin add <users> : Add one or more admin users \n' +
      '/admin remove <users> : Remove one or more admin users \n\n' +
      '*Other Commands*\n' +
      '/cancel : cancels the last operation and enter a new command\n' +
      '/help :  Returns a list of commands and information on how to interact with the ProxyBot\n' +
      '/version : returns the version information of the integration\n'
    // '/files : To get a list of saved files that contain rooms'
    // var sMessage = WickrIOAPI.cmdSendRoomMessage(vGroupID, reply);
    return {
      reply,
      state: State.NONE,
    }
  }
}

module.exports = Help
