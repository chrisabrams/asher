function respond(options = {}) {

  return (req, res, next) => {

    let response = req.response || {message: 'The request was received but nothing was returned.'}
    const status = response.status || process.env.HTTP_ERROR_CODE

    if(response.error) {
      response = response.error
    }

    res
      .status(status)
      .json(response)

  }

}

module.exports = respond
