const dispatch = require('./dispatch')
const express = require('express')
const parserMiddleware = require('./parser/middleware')
const respond = require('./respond')

class Router {

  constructor(options = {}) {
    this.controller = options.controller
    this.name = options.name
    this.parent = options.parent

    let mergeParams = (this.parent) ? true : false
    this.routes = express.Router({mergeParams})
  }

  delete(options = {}, dispatchOptions = {}) {
    return this.verb('delete', options, dispatchOptions)
  }

  generateMiddleware() {

  }

  get(options = {}, dispatchOptions = {}) {
    return this.verb('get', options, dispatchOptions)
  }

  patch(options = {}, dispatchOptions = {}) {
    return this.verb('patch', options, dispatchOptions)
  }

  post(options = {}, dispatchOptions = {}) {
    return this.verb('post', options, dispatchOptions)
  }

  verb(v, options = {}, dispatchOptions = {}) {
    const {action, middleware, parser, route, schema} = options
    //const foo = (req, res) => {res.json({pkg: req.body})}
    let _middleware = []

    if(parser) {
      _middleware.push(parserMiddleware(parser))
    }

    if(schema) {

      if(typeof schema instanceof Array) {
        _middleware = _middleware.concat(schema)
      }
      else {
        _middleware.push(schema)
      }
      
    }

    if(middleware instanceof Array) {
      _middleware = _middleware.concat(middleware)
    }

    _middleware.push(dispatch(this.controller, action, dispatchOptions), respond())
    //console.log('_middleware', _middleware)
    this.routes[v](route, _middleware)
  }

}

module.exports = Router
