const bigquery = require('../index')

function listDatasets() {

  return bigquery.getDatasets()

}

module.exports = listDatasets
