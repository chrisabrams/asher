const path = require('path')

let keyfilePath = null

try {
  if(process.env.GCLOUD_CREDENTIALS_PATH) {
    keyfilePath = path.resolve(process.env.GCLOUD_CREDENTIALS_PATH)
  }
}
catch(e) {}

module.exports = keyfilePath
