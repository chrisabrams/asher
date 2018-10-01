function parserMiddleware(parser) {

  return function onParserMiddleware(req, res, next) {

    if(!req._body) {
      req._body = Object.assign({}, req.body)
    }
    if(!req._headers) {
      req._headers = Object.assign({}, req.headers)
    }
    if(!req._query) {
      req._query = Object.assign({}, req.query)
    }

    const {body, headers, query} = parser(Object.assign({}, req.body), Object.assign({}, req.headers), Object.assign({}, req.query))

    if(body) {
      req.body = body
    }
    if(headers) {
      req.headers = headers
    }
    if(query) {
      req.query = query
    }

    next()

  }

}

module.exports = parserMiddleware
