
const WickrIOAPI = require('wickrio_addon');
const fs = require('fs');
const { exec, execSync, execFileSync } = require('child_process');
const logger = require('../logger');

class WhitelistRepo {

  constructor(fs) {
    const tokens = JSON.parse(process.env.tokens);
    if (tokens.WHITELISTED_USERS.encrypted) {
      this.whitelist = WickrIOAPI.cmdDecryptString(tokens.WHITELISTED_USERS.value);
    } else {
      this.whitelist = tokens.WHITELISTED_USERS.value;
    }
    this.whitelist = this.whitelist.split(',');

    // Make sure there are no white spaces on the whitelisted users
    for (let i = 0; i < this.whitelist.length; i++) {
      this.whitelist[i] = this.whitelist[i].trim();
    }
  }

  getWhitelist() {
    return this.whitelist;
  }

  updateWhitelist(wlUsers) {
    this.whitelist = wlUsers;
    let processes;
    try {
      processes = fs.readFileSync('./processes.json', 'utf-8');
      if (!processes) {
        logger.error('Error reading processes.json!');
        return;
      }
    } catch (err) {
      logger.error(err);
      return;
    }

    const pjson = JSON.parse(processes);
    logger.debug(pjson.apps[0].env.tokens.WHITELISTED_USERS.value);

    const usersString = wlUsers.join(',');

    if (pjson.apps[0].env.tokens.WHITELISTED_USERS.encrypted) {
      const wlUsersEncrypted = WickrIOAPI.cmdEncryptString(usersString);
      pjson.apps[0].env.tokens.WHITELISTED_USERS.value = wlUsersEncrypted;
    } else {
      pjson.apps[0].env.tokens.WHITELISTED_USERS.value = usersString;
    }

    logger.debug('pjson', pjson.apps[0].env.tokens.WHITELISTED_USERS.value);

    try {
      const cp = execSync('cp processes.json processes_backup.json');
      const ps = fs.writeFileSync('./processes.json', JSON.stringify(pjson, null, 2));
    } catch (err) {
      logger.error(err);
    }
  }

  sendToWhitelist(message) {
    return WickrIOAPI.cmdSend1to1Message(this.whitelist, message);
  }
}

export default WhitelistRepo
