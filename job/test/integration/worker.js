const path = require('path')
const Worker = require('../../worker')

describe('Integration: Worker', function() {

  it('should queue a worker with an external processor', function(done) {

    const worker = new Worker({
      label: 'coinbase_worker',
      processorPath: path.join(__dirname, '../helpers/processor.js')
    })

    worker.job._queue.on('completed', (job, result) => {
      done()
    })

    worker.queue({
      base: "usd",
      exchange: "coinbase",
      open: "7441.54",
      symbol: "btc"
    })

  })

  it('should queue a worker with an external processor on a repeatable schedule', function(done) {
    this.timeout(180000)

    const worker = new Worker({
      label: 'coinbase_worker_date',
      processorPath: path.join(__dirname, '../helpers/processor_date.js'),
      repeat: {
        cron: '*/1 * * * *'
      }
    })

    let count = 0
    worker.job._queue.on('completed', (job, result) => {
      count++
      
      if(count > 1) {
        done()
      }
    })

    worker.queue({
      base: "usd",
      exchange: "coinbase",
      open: "7441.54",
      symbol: "btc"
    })

  })

})
