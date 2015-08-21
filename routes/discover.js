/**
 * Module dependencies
 */

var Scope = require('../models/Scope')

/**
 * Well-Known Endpoint
 */

module.exports = function (server) {
  /**
   * OpenID Provider Configuration Information
   */

  server.get('/.well-known/openid-configuration', function (req, res, next) {
    Scope.list(function (err, scopes) {
      if (err) { return next(err) }

      // Get a list of scope names
      scopes = scopes.map(function (scope) {
        return scope.name
      })

      // Update the OpenIDConfiguration and respond
      server.OpenIDConfiguration.scopes_supported = scopes
      res.json(server.OpenIDConfiguration)
    })
  })

}
