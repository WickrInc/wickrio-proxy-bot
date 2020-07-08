
const state = require('../state');
const logger = require('../logger');
const pkgjson = require('../../package.json');

class Version {
  execute() {
    const reply = `*Versions*\nIntegration: ${pkgjson.version
    }\nWickrIO Addon: ${pkgjson.dependencies.wickrio_addon
    }\nWickrIO API: ${pkgjson.dependencies['wickrio-bot-api']}`;
    const obj = {
      reply,
      state: state.NONE,
    };
    return obj;
  }

  shouldExecute() {

  }
}

module.exports = Version;
