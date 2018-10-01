const Buffer = require('./buffer')

function toString(s, type) {

  switch(type) {

    case 'base64':
      return new Buffer(s, type).toString('utf8')

  }

}

module.exports = toString
