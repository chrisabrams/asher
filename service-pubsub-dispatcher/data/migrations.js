process.on('uncaughtException', function(err) {
  console.error(err)
})

process.on('unhandledRejection', function(err) {
  console.error(err)
})

const path = require('path')
const envPath = path.join(__dirname, '../.env')
require('dotenv').config({ path: envPath })

const Model = require('@asher/google-cloud/datastore/model')

async function task() {

  const entries = new Model({kind: 'pubsub_dispatcher', namespace: process.env.GCLOUD_DATASTORE_NAMESPACE})

  try {

    await entries.upsert({
      "id": "a6897830-8ba2-11e8-9c80-27941bec4448",
      "from": "exchange-coinbase-fetch-end",
      "to": ["exchange-coinbase-cache-start"]
    })

    /*await entries.upsert({
      "id": "a6897830-8ba2-11e8-9c80-27941bec4448",
      "from": "exchange-coinbase-cache-end",
      "to": ["..."]
    })*/
  
    console.log('Migration completed!')

  }
  catch(e) {
    console.error('Migration failed\n', e)
  }

}

task()
