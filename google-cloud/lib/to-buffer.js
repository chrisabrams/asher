const Buffer = require('./buffer')

function toBuffer(o) {

  if(typeof o == 'string') {
    return Buffer.from(o)
  }

  if(typeof o == 'object') {
    return Buffer.from(JSON.stringify(o))
  }

  throw new Error('Argument must be an object or string.')

}

module.exports = toBuffer
