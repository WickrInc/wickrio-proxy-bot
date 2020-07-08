import pino from "pino"

const logger = pino({
  prettyPrint: {
    translateTime: true,
    ignore: 'pid,hostname',
  },
  level: 'debug',
});

let { debug } = logger


export default {
  debug
}