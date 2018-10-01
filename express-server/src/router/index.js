const dispatch = require('./dispatch')
const {removeHook, registerHook, triggerHook} = require('./hooks')
const Router = require('./router')
const respond = require('./respond')

module.exports = Router
module.exports.dispatch = dispatch
module.exports.removeHook = removeHook
module.exports.registerHook = registerHook
module.exports.respond = respond
module.exports.triggerHook = triggerHook
