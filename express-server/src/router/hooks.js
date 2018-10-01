const uuid = require('@asher/uuid')

const hooks = {
  services: {
    after: new Map(),
    before: new Map()
  }
}

function registerHook(hook, cb) {

  const h = Object.assign({}, hook)
  const _hooks = []
  const name = h.serviceName
  const when = h.when

  try {

    if(!hooks.services[when].get(name)) {
      hooks.services[when].set(name, [])
    }

    for(const actionName of hook.actionNames) {

      const hook = {
        id: uuid(),
        name,
        actionName: actionName,
        operation: cb,
        serviceName: name,
        when
      }

      hooks.services[when].get(name).push(hook)
      _hooks.push(hook.id)

    }

  }
  catch(e) {
    console.error('Could not register hook', e)
  }

  return _hooks

}

function removeHook(options = {}) {

  const {id, ids, serviceName} = options
  const name = serviceName
  const when = 'after'

  try {

    if(!hooks.services[when].get(name)) {
      hooks.services[when].set(name, [])
    }

    const _hooks = hooks.services[when].get(name)

    for(let i = 0, l = _hooks.length; i < l; i++) {
      const hook = _hooks[i]

      if(typeof id == 'string' && id == hook.id || ids instanceof Array && ids.includes(hook.id)) {
        _hooks.splice(i, 1)
      }
    }

    hooks.services[when].set(_hooks)

  }
  catch(e) {
    console.error('Could not remove hook', e)
  }

}

function triggerHook(options = {}, data = {}) {

  const {actionName, serviceName, when} = options

  const _hooks = hooks.services[when].get(serviceName)

  if(_hooks instanceof Array) {

    for(let i = 0, l = _hooks.length; i < l; i++) {
      const hook = _hooks[i]

      if(hook.actionName == actionName) {

        hook.operation(data, hook)

      }
    }

  }

}

module.exports.hooks = hooks
module.exports.registerHook = registerHook
module.exports.removeHook = removeHook
module.exports.triggerHook = triggerHook
