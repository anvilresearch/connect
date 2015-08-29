/**
 * Module dependencies
 */

var oidc = require('../oidc')
var settings = require('../boot/settings')
var userApplications = require('../models/UserApplications')

/**
 * Exports
 */

module.exports = function (server) {
  /**
   * Applications
   */

  server.get('/applications',
    oidc.parseAuthorizationHeader,
    oidc.getBearerToken,
    oidc.verifyAccessToken({
      iss: settings.issuer,
      key: settings.keys.sig.pub,
      required: false
    }),
    oidc.authenticateUser,
    function (req, res, next) {
      userApplications(req.user, function (err, apps) {
        if (err) { return next(err) }
        res.json(apps)
      })
    })

}
