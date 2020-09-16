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
      '*ProxyBot Definitions*\n' +
      'admin: a user who can give aliases to users and adding them to the group of users who can communicate with the asset' +
      'alias: the name you would like to give to a user when communicating with assets, this will show up in the signature of messages sent through the ProxyBot to the asset' +
      'asset: the user outside of your network that you would like to communicate with anonymously' +
      'group: this is the list of users who have been given aliases and can communicate with the asset through the ProxyBot' +
      'member: a user who has been given an alias and can communicate with assets' +
      '*ProxyBot Commands*\n' +
      '/add <member> <alias>: adds member with the given alias to the list of users\n' +
      '/asset <asset>: creates an asset that will recieve messages from the ProxyBot using the /send command\n' +
      '/create : creates a room with the group of members, use the /send command in this room to communicate with the asset\n' +
      '/delete <asset> : deletes asset from the list of assets\n' +
      '/list : returns the current list of members in the group and the assets available to send to\n' +
      '/remove <members> : removes a whitespace delimited list of users from the group\n' +
      '/send <message> : sends a message to the asset in the form of a one-to-one conversation with the ProxyBot, must be sent in the room created with the /create command\n' +
      '\n*Admin Commands*\n' +
      '/admin list : Get list of admin users \n' +
      '/admin add <users> : Add one or more admin users \n' +
      '/admin remove <users> : Remove one or more admin users \n\n' +
      '*Other Commands*\n' +
      '/cancel : cancels the last command sent allowing for a new command to be entered\n' +
      '/help :  Returns a list of commands and information on how to interact with the ProxyBot\n' +
      '/version : returns the version information of the integration\n'
    return {
      reply,
      state: State.NONE,
    }
  }
}

module.exports = Help
