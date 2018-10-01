const pubsub = require('./index')
const toBuffer = require('../lib/to-buffer')

async function publish(_topic, o) {
  
  try {
    const topic = pubsub.topic(_topic)
    const publisher = topic.publisher()

    await publisher.publish(toBuffer(o))
  }
  catch(e) {
    console.error('Could not publish\n', e)
  }


}

module.exports.publish = publish
