const BigQuery = require('@google-cloud/bigquery')

const bigquery = new BigQuery({
  projectId: process.env.GCLOUD_PROJECT,
})

module.exports = bigquery
