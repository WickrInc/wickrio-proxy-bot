import State from "../state";
import { version, dependencies } from "../../package.json";

class Version {
  execute() {
    const reply = `*Versions*\nIntegration: ${version}\nWickrIO Addon: ${dependencies.wickrio_addon}\nWickrIO API: ${dependencies["wickrio-bot-api"]}`;
    const obj = {
      reply,
      state: state.NONE,
    };
    return obj;
  }

  shouldExecute() {}
}

export default Version;
