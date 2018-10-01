const _Redis = require('ioredis')

class Redis {

  constructor() {

    this.client = Redis.createConnection()

  }

  static createConnection() {

    return new _Redis({
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      family: 4,
      password: process.env.REDIS_PASSWORD,
      db: 0
    })

  }

}

module.exports = Redis
