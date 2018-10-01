const datastore = require('./index')

module.exports = function createTransaction(cb) {
  return cb(datastore.transaction())
}
