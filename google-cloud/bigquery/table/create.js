const bigquery = require('../index')

function createTable(options = {}) {

  const {datasetId, schema, tableId} = options

  return bigquery
    .dataset(datasetId)
    .createTable(tableId, {
      schema
    })

}

module.exports = createTable
