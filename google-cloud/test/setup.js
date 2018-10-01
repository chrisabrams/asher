process.on('uncaughtException', function(err) {
  console.error(err)
})

process.on('unhandledRejection', function(err) {
  console.error(err)
})

const path = require('path')
const envPath = path.join(__dirname, '../.env')
require('dotenv').config({ path: envPath })

global.expect = require('chai').expect
