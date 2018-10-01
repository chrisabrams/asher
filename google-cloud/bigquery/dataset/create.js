const bigquery = require('../index')

function createDataset(datasetId) {

  return bigquery.createDataset(datasetId)

}

module.exports = createDataset
