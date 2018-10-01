const Datastore = require('@google-cloud/datastore')
const keyFilename = require('../lib/keyfile-path')

module.exports = function createDatastore(_options = {}) {

  const options = {
    keyFilename,
    projectId: process.env.GCLOUD_PROJECT,
  }
  
  if(process.env.GCLOUD_DATASTORE_NAMESPACE) {
    options.namespace = process.env.GCLOUD_DATASTORE_NAMESPACE
  }

  if(!_options.namespace) {
    delete _options.namespace
  }

  const __options = Object.assign({}, options, _options)

  return new Datastore(__options)

}
