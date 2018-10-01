const path = require('path')
const Queue = require('bull')
const Redis = require('@asher/redis')

const _client = Redis.createConnection()
const _subscriber = Redis.createConnection()

const redisOptions = {
  createClient: function(type) {
    switch (type) {
      case 'client':
        return _client
      case 'subscriber':
        return _subscriber
      default:
        return Redis.createConnection()
    }
  }
}

class Job {

  constructor(options = {}) {

    const {defaultJobOptions, label, repeat} = options

    this.cleanOnStart = true
    this.defaultJobOptions = Object.assign({}, {
      attempts: 3,
      removeOnComplete: true,
      repeat
    }, defaultJobOptions)
    this.label = label
    this.options = options

    /*
    NOTE:
    Enables functions to be called (queued up) before job is ready
    */
    this._readyReject = null
    this._readyResolve = null
    this.ready = new Promise( (resolve, reject) => {
      this._readyReject = reject
      this._readyResolve = resolve
    })

    this.init()
  }

  /*
  NOTE:
  For the most part this function serves as a hack as Bull documentation
  lacks some necessary API calls to clean up previous jobs or update
  a job with new configuration.
  */
  clean() {

    const pattern = `bull:${this.label}:*`

    return new Promise(async (resolve, reject) => {

      try {

        const stream = _client.scanStream({
          match: pattern
        })

        stream.on('data', function(keys) {

          if(keys.length) {
            const pipeline = _client.pipeline()

            keys.forEach(function(key) {
              //console.error('key', key)
              pipeline.del(key)
            })

            pipeline.exec()
          }
        })

        stream.on('end', function() {
          console.log('Cleaned job', pattern)

          resolve()
        })
        stream.on('error', reject)

      }
      catch(e) {
        console.error('Failed to clean\n', e)

        reject(e)
      }

    })

  }

  async init() {
    if(this.cleanOnStart) {
      await this.clean()
    }

    this._queue = new Queue(this.label, redisOptions)
    this._queue.empty()

    this.initLogging()

    let _process = null
    if(typeof this.options.process == 'function') {
      _process = this.options.process.bind(this)
    }
    else if(typeof this.processorPath == 'string') {
      _process = path.resolve(this.processorPath)
    }
    else if(typeof this.process == 'function') {
      _process = this.process.bind(this)
    }

    if(_process) {
      this._queue.process(_process)
    }

    this._readyResolve() // Ready

    process.on('SIGINT', () => {
      this._queue.close()
    })

  }

  initLogging() {
    this._queue.on('active', (job) => this.onEvent('active', {data: job.data}))
    this._queue.on('cleaned', () => this.onEvent('cleaned'))
    this._queue.on('completed', (job, result) => this.onEvent('completed', {result}))
    this._queue.on('drained', () => this.onEvent('drained'))
    this._queue.on('error', (err) => this.onEvent('error', err, 'error'))
    this._queue.on('failed', (job, err) => this.onEvent('failed', err, 'error'))
    this._queue.on('paused', () => this.onEvent('paused'))
    this._queue.on('progress', (job, progress) => this.onEvent('progress', {progress}))
    this._queue.on('resumed', () => this.onEvent('resumed'))
    this._queue.on('stalled', () => this.onEvent('stalled'))
  }

  onEvent(event, data, level = 'debug') {
    console.error(`Queue: ${this.label} ${event}`, data)
  }

  async queue(data, options = {}) {
    await this.ready

    const jobOptions = Object.assign({}, this.defaultJobOptions, options)

    this._queue.add(data, jobOptions)

    this.onEvent('queue', {data, jobOptions})
  }

}

module.exports = Job
