const bigquery = require('../index')

function listTables(datasetId) {

  return bigquery
    .dataset(datasetId)
    .getTables()

}

module.exports = listTables
