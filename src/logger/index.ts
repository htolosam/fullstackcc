import { logType } from '../core'

var filename = __dirname + '/fullstack.log'

const log = require('simple-node-logger').createSimpleLogger(filename)

const writeLog = (msg: any, type: any) => {
    switch (type) {
        case logType.info:
            log.info(msg);
            break
        case logType.warn:
            log.warn(msg);
            break
        case logType.error:
            log.error(msg);
            break
        case logType.trace:
            log.trace(msg);
            break
        case logType.debug:
            log.debug(msg);
            break
        default:
            log.fatal(msg);
            break

    }
}

export {writeLog, logType}