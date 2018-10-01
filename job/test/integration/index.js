const Job = require('../../index')
const path = require('path')

describe('Integration: Job', function() {

  it('should queue a job', function(done) {

    class CoinbaseJob extends Job {

      constructor(options = {}) {
        super({
          label: 'coinbase_simple'
        })
      }

      process(job) {
        return Promise.resolve()
      }

    }

    const job = new CoinbaseJob()

    job._queue.on('completed', (job, result) => {
      done()
    })

    job.queue({
      base: "usd",
      exchange: "coinbase",
      open: "7441.54",
      symbol: "btc"
    })

  })

  it('should queue a job with an external processor', function(done) {

    class CoinbaseJob extends Job {

      constructor(options = {}) {
        super({
          label: 'coinbase_external_processor',
          processorPath: path.join(__dirname, '../helpers/processor.js')
        })
      }

    }

    const job = new CoinbaseJob()

    job._queue.on('completed', (job, result) => {
      done()
    })

    job.queue({
      base: "usd",
      exchange: "coinbase",
      open: "7441.54",
      symbol: "btc"
    })

  })

  it('should run a job with a schedule', function(done) {
    this.timeout(120000)

    class CoinbaseJob extends Job {

      constructor(options = {}) {
        super({
          label: 'coinbase_schedule',
          processorPath: path.join(__dirname, '../helpers/processor.js'),
          repeat: {
            cron: '*/1 * * * *'
          }
        })
      }

    }

    const job = new CoinbaseJob()

    job._queue.once('completed', (job, result) => {
      done()
    })

  })

  it('should queue a job with a schedule', function(done) {
    this.timeout(120000)

    class CoinbaseJob extends Job {

      constructor(options = {}) {
        super({
          label: 'coinbase_schedule_queue',
          processorPath: path.join(__dirname, '../helpers/processor.js'),
          repeat: {
            cron: '*/1 * * * *'
          }
        })
      }

    }

    const job = new CoinbaseJob()

    job._queue.once('completed', (job, result) => {
      done()
    })

    job.queue({
      base: "usd",
      exchange: "coinbase",
      open: "7441.54",
      symbol: "btc"
    })

  })

})
