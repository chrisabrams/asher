const Buffer = require('./buffer')
const toString = require('./to-string')

function bufferToObject(b) {

  const s = toString(b, 'base64')
  return JSON.parse(s)

}

function messageDataToObject(data) {

  let result = {}

  try {

    //console.log(`INSIDE HERE: data (typeof data) ${typeof data}\n`, data)

    let __data = data

    if(data.data) {
      __data = data.data
    }

    // is Buffer
    if(Buffer.isBuffer(__data)) {
      //console.log('DEBUG: is Buffer')
      result = bufferToObject(__data)
    }
    // is String
    else if(typeof __data == 'string') {
      //console.log('DEBUG: is String')
      result = JSON.parse(__data)
    }
    // is Object
    else {
      //console.log('DEBUG: is Object')
      result = __data
    }

    //console.log(`OUTSIDE HERE: result (typeof result) ${typeof result}\n`, result)

  }
  catch(e) {
    console.error('Could not convert message data\n', e)
    console.error('Message data\n', data)
  }

  return result

}

module.exports = messageDataToObject
