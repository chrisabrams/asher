const methodChainMixin = {
  _addToChain(step) {

    this._steps.push({step: (typeof step == 'function') ? step : () => step})

    return this

  },
  _reset() {
    this._steps = []
  },
  run(cb) {
    let data

    return new Promise(async (resolve, reject) => {

      try {

        for(let i = 0, l = this._steps.length; i < l; i++) {
          const {step} = this._steps[i]
  
          data = await step(data)
        }

        if(typeof cb == 'function') {
          resolve(cb(data))
          return
        }

        resolve(data)

      }
      catch(e) {
        reject(e)
      }

    })
  },
  _steps: []
}

module.exports = methodChainMixin
