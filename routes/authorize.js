/**
 * Module dependencies
 */

var oidc = require('../oidc')

/**
 * Authorize Endpoint
 */

module.exports = function (server) {
  var handler = [
    oidc.selectConnectParams,
    oidc.validateAuthorizationParams,
    oidc.verifyClient,
    oidc.requireSignin,
    oidc.determineUserScope,
    oidc.promptToAuthorize,
    oidc.authorize
  ]

  if (oidc.beforeAuthorize) {
    handler.splice(handler.length - 1, 0, oidc.beforeAuthorize)
  }

  server.get('/authorize', handler)
  server.post('/authorize', handler)
}
