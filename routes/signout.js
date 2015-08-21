/**
 * Module dependencies
 */

var oidc = require('../oidc')

/**
 * Export
 */

module.exports = function (server) {
  /**
   * Signout
   */

  server.get('/signout', oidc.signout)
  server.post('/signout', oidc.signout)

}
