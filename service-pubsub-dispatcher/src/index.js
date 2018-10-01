process.on('uncaughtException', function(err) {
  console.error(err)
})

process.on('unhandledRejection', function(err) {
  console.error(err)
})

const path = require('path')

try {
  const envPath = path.join(process.cwd(), './.env')
  require('dotenv').config({ path: envPath })
}
catch(e) {}

const logger = require('@asher/logger')
const Model = require('@asher/google-cloud/datastore/model')
const {publish} = require('@asher/google-cloud/pubsub/publisher')
const {subscribe} = require('@asher/google-cloud/pubsub/subscriber')
const messageDataToObject = require('@asher/google-cloud/lib/message-data-to-object')

const publishers = {}
const subscribers = {}

function onMessageWrapper(from, to) {

  return function onMessage(message) {
    //console.log('onMessage', from, to)

    let data = {}

    try {
      data = messageDataToObject(message)
    }
    catch(e) {
      logger.error('Could not convert data on message\n', e)
    }

    try {
      for(let j = 0, k = to.length; j < k; j++) {
        const destination = to[j]
  
        publish(destination, data)
        //console.log('published to', name)
      }
  
      message.ack()
    }
    catch(e) {
      logger.error('Could not dispatch message\n', e)
    }

    /*
    NOTE:
    Store logs of message queue dispatching into Datastore
    */
    if(process.env.PUBSUB_DISPATCHER_LOGS) {
      logger.debug('Storing logs in Datastore')
      try {
        const model = new Model({kind: process.env.PUBSUB_DISPATCHER_LOGS, namespace: process.env.GCLOUD_DATASTORE_NAMESPACE})
  
        for(let j = 0, k = to.length; j < k; j++) {
          const destination = to[j]

          const log = {
            data,
            destination,
            source: from
          }

          logger.debug('Log stored in Datastore', log)
          model.insert(log)
        }
  
      }
      catch(e) {
        logger.error('Could not log message\n', e)
      }

    }

  }

}

const model = new Model({kind: process.env.PUBSUB_DISPATCHER_KIND, namespace: process.env.GCLOUD_DATASTORE_NAMESPACE})

async function onInterval() {

  try {

    const mapping = await model.getAll()
    //console.error('mapping', mapping)
    for(let i = 0, l = mapping.length; i < l; i++) {
      const item = mapping[i]
    
      const from = item.from
      const to = item.to

      // Remove old subscriber
      if(subscribers[from]) {
        subscribers[from].removeListener('message', onMessageWrapper(from, to))
      }

      // Create new Subscribers
      //console.log('Creating from:', from)
      subscribers[from] = subscribe(from)

      // Each subscriber handler passes the message to each publisher
      subscribers[from].on('message', onMessageWrapper(from, to))
    }

  }
  catch(e) {
    logger.error('Could not process subscribers\n', e)
  }

}

function service() {

  onInterval()
  const interval = setInterval(onInterval, parseInt(process.env.PUBSUB_DISPATCHER_INTERVAL))

}

module.exports = service
