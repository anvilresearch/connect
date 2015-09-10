/**
 * Module dependencies
 */

var oidc = require('../oidc')

/**
 * Session endpoint
 */

module.exports = function (server) {
  /**
   * Check session iframe
   */

  server.get('/session', oidc.session)

  /**
   * Session Events endpoint
   * (push updates to client)
   */

  server.get('/session/events', oidc.sessionEvents)
}
