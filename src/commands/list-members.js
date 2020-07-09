import { NONE } from "../state";

class ListMembers {
  constructor(memberListRepository) {
    this.memberList = memberListRepository;
  }

  shouldExecute() {}

  execute() {
    const members = this.memberList.getMemberList();
    let reply;
    if (members === undefined || members.length === 0) {
      reply = "List of members is currently empty";
    } else {
      const userList = members.join("\n");
      reply = `Current members:\n${userList}`;
    }
    const obj = {
      reply,
      state: NONE,
    };
    return obj;
  }
}

export default ListMembers;
