import State from "../state";

class Help {
  static shouldExecute(messageService) {
    if (messageService.getCommand() === "/help") {
      return true;
    }
    return false;
  }

  static execute() {
    const reply =
      "*Room Commands*\n" +
      "/create <question> : This will create a new room with the group of users posting your question\n" +
      "/add <members> : This will add a comma separated list of users to the group\n" +
      "/remove <members> : This will remove a comma separated list of users from the group\n" +
      "/list : This will return the list of users currently in the group\n\n" +
      "*Admin Commands*\n" +
      "/admin list : Get list of admin users \n" +
      "/admin add <users> : Add one or more admin users \n" +
      "/admin remove <users> : Remove one or more admin users \n\n" +
      "*Other Commands*\n" +
      "/help : Show help information\n" +
      "/version : Get the version of the integration\n" +
      "/cancel : To cancel the last operation and enter a new command\n" +
      "/files : To get a list of saved files that contain rooms";
    // var sMessage = WickrIOAPI.cmdSendRoomMessage(vGroupID, reply);
    const obj = {
      reply,
      state: state.NONE,
    };
    return obj;
  }
}

module.exports = Help;
