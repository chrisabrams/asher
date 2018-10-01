const pubsub = require('./index')

async function createSubscription(topicName, subscriptionName) {

  if(!subscriptionName) {
    subscriptionName = topicName
  }

  try {

    await pubsub
      .topic(topicName)
      .createSubscription(subscriptionName)

  }
  catch(e) {
    console.error('Could not create topic subscription\n', e)
  }

}

async function createTopic(topicName) {

  try {

    await pubsub
      .createTopic(topicName)

  }
  catch(e) {
    console.error('Could not create topic\n', e)
  }

}

module.exports.createSubscription = createSubscription
module.exports.createTopic = createTopic
