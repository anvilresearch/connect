/**
 * Module dependencies
 */

var oidc = require('../oidc')

/**
 * E-mail Verification Endpoint
 */

module.exports = function (server) {
  server.get('/email/verify', [
    oidc.selectConnectParams,
    oidc.verifyRedirectURI,
    oidc.verifyEmail
  ])
}
