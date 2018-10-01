const bigquery = require('../index')

function deleteDataset(datasetId) {

  const dataset = bigquery.dataset(datasetId)

  return dataset.delete()

}

module.exports = deleteDataset
