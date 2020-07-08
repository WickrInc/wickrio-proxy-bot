
const WickrIOAPI = require('wickrio_addon');
const logger = require('../logger');
const state = require('../state');

// TODO use this instead of putting it in main!
class CreateRoom {
  shouldExecute() {
  }

  execute(members, moderators, title, description) {
    let reply = 'Room created.';
    if (members === undefined || members.length === 0) {
      reply = 'Alias contains no members';
    } else if (description === undefined || description === '') {
      reply = 'Invalid /create command Usage: /create <question>';
    } else {
      const uMessage = WickrIOAPI.cmdAddRoom(members, moderators, title, description, '', '');
      const vGroupID = JSON.parse(uMessage).vgroupid;
      logger.debug(`Here is the uMessage${uMessage}`);
      logger.debug(`Here is the vGroupID${vGroupID}`);
      WickrIOAPI.cmdSendRoomMessage(vGroupID, description);
      // WickrIOAPI.cmdLeaveRoom(vGroupID);
    }
    const obj = {
      reply,
      state: state.NONE,
    };
    return obj;
  }
}


module.exports = CreateRoom;
