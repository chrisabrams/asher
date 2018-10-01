const methodChainMixin = require('@asher/misc/method-chain-mixin')
const request = require('superagent')

class FetchJSON {

  constructor(options = {}) {
    this.headers = options.headers
    this.url = options.url
  }

  fetch(options = {}) {

    return this._addToChain(new Promise(async(resolve, reject) => {
      const responseTimeout = options.responseTimeout || 15000

      try {
        let result = null

        if(this.headers) {

          result = await request
            .get(this.url)
            .set(this.headers)
            .timeout({
              response: responseTimeout
            })
            .then((res) => res.body)

        }
        else {

          result = await request
            .get(this.url)
            .timeout({
              response: responseTimeout
            })
            .then((res) => res.body)

        }

        resolve(result)
      }
      catch(e) {
        reject(e)
      }

    }))

  }

  parse(fn) {

    return this._addToChain( (data) => {
      return new Promise( (resolve, reject) => {

        try {
          let result

          if(typeof fn == 'function') {
            result = fn(data)
          }
          else {
            result = data
          }

          resolve(result)
        }
        catch(e) {
          reject(e)
        }

      })
    })
    .run()

  }

}

Object.assign(FetchJSON.prototype, methodChainMixin)
module.exports = FetchJSON
