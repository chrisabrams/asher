const Job = require('../index')

class Worker {

  constructor(options = {}) {

    this.job = new Job(options)

  }

  queue() {
    this.job.queue.apply(this.job, arguments)
  }

}

module.exports = Worker
