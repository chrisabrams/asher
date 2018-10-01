const pubsub = require('./index')

function subscribe(topic) {
  return pubsub.subscription(topic)
}

module.exports.subscribe = subscribe
