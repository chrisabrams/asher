const keyFilename = require('../lib/keyfile-path')

const path = require('path')
const Pubsub = require('@google-cloud/pubsub')
const pubsub = Pubsub({
  keyFilename,
  projectId: process.env.GCLOUD_PROJECT
})

module.exports = pubsub
