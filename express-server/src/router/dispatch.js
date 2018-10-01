const {hooks} = require('./hooks')

function dispatch(controller, action, options = {}) {

  const actionName = options.actionName
  const serviceName = options.serviceName

  return async (req, res, next) => {

    try {
      const result = await controller[action].call(controller, req, res)

      const response = {
        pkg: result,
        status: (req.method == 'POST') ? (process.env.HTTP_CREATE_CODE || 201) : (process.env.HTTP_SUCCESS_CODE || 200)
      }

      if(typeof serviceName == 'string') {

        const afterHooks = hooks.services.after.get(serviceName)

        if(afterHooks instanceof Array) {

          for(let i = 0, l = afterHooks.length; i < l; i++) {
            const hook = afterHooks[i]

            if(hook.actionName == actionName) {

              response.pkg = await hook.operation(req, response.pkg)

            }
          }

        }

      }

      req.response = response

      next()
    }
    catch(e) {
      next(e)
    }

  }

}

module.exports = dispatch
