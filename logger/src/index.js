const winston = require('winston')

const logger = winston.createLogger({
  level: (process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'silly',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )    
    })
  ]
})

class Logger {

  constructor() {
    return logger
  }

}

module.exports = new Logger()
module.exports.Logger = Logger
module.exports.compose = function compose(options = {}) {
  const _this = this
  const logger = new Logger(options)

  return {
    _error: {
      code: 'UNKNOWN_CODE',
      codeProvided: null,
      data: {},
      e: null,
      message: 'Uknown error; this has not been classified',
      stack: null,
      status: 500,
      type: 'unknown',
      uncaught: false,
      unhandled: false
    },

    compose(options = {}) {

      if(options.code) {
        this._error.code = options.code
        this._error.codeProvided = options.code
      }

      if(options.error) {
        this._error.e = options.error
        this._error.message = e.message || this._error.message
        this._error.stack = e.stack
      }

      if(options.status) {
        this._error.status = parseInt(options.status) || this._error.status
      }

      return this

    },
    debug() {
      logger.debug.apply(logger, arguments)

      return this._result
    },
    error() {

      if(this._error._uncaught) {
        logger.debug('The following error was uncaught')
      }
  
      if(this._error._unhandled) {
        logger.debug('The following error was unhandled')
      }

      logger.error.apply(logger, arguments)

      return this._result
    },
    log() {
      logger.log.apply(logger, arguments)

      return this._result
    },
    logger,
  }

}
