
import WickrIOAPI from 'wickrio_addon';
import { debug } from '../logger';
import { NONE } from '../state';

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
      debug(`Here is the uMessage${uMessage}`);
      debug(`Here is the vGroupID${vGroupID}`);
      WickrIOAPI.cmdSendRoomMessage(vGroupID, description);
      // WickrIOAPI.cmdLeaveRoom(vGroupID);
    }
    const obj = {
      reply,
      state: NONE,
    };
    return obj;
  }
}


export default CreateRoom;
