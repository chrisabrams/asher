const bigquery = require('../index')

function deleteTable(datasetId, tableId) {

  return new Promise(async (resolve, reject) => {

    bigquery
      .dataset(datasetId)
      .table(tableId)
      .delete()
      .then(() => {
        console.log(`Table ${tableId} deleted.`)
        resolve()
      })
      .catch(err => {
        console.error('Could not delete table', err)
        resolve()
      })

  })

}

module.exports = deleteTable
