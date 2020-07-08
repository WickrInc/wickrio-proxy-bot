
const logger = require('../logger');

class MemberListRepo {
  // constructor(fs){
  // TODO what if this returns false??
  constructor(fs) {
    this.fs = fs;
    let memberData;
    try {
      if (fs.existsSync('./files/members.json')) {
        memberData = fs.readFileSync('./files/members.json');
        if (!memberData) {
          logger.error('Error reading members.json!');
          return;
        }
        this.members = JSON.parse(memberData);
        // this.members = pjson.value;
        logger.debug(`Members is:${this.members}`);
      } else {
        this.members = [];
        this.updateMemberList(this.members);
      }
    } catch (err) {
      logger.error(err);
    }
  }

  getMemberList() {
    return this.members;
  }

  // TODO fix this
  // Make add and remove
  updateMemberList(memberList) {
    this.members = memberList;
    try {
      logger.debug(`This is the memberList: ${memberList}`);
      const memberListToWrite = JSON.stringify(memberList);
      if (!this.fs.existsSync('./files')) {
        this.fs.mkdirSync('./files');
      }
      this.fs.writeFile('./files/members.json', memberListToWrite, (err) => {
        // TODO Fix this
        if (err) throw err;
        logger.trace('Current Members saved in file');
      });
      return memberList.toString();
    } catch (err) {
      logger.error(err);
    }
  }
}

module.exports = MemberListRepo;
