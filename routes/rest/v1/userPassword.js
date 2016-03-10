/**
 * Module dependencies
 */

var User = require('../../../models/User')
var NotFoundError = require('../../../errors/NotFoundError')
var settings = require('../../../boot/settings')
var oidc = require('../../../oidc')

/**
 * Export
 */

module.exports = function (server) {
  /**
   * Token-based Auth Middleware
   */

  var authorize = [
    oidc.parseAuthorizationHeader,
    oidc.getBearerToken,
    oidc.verifyAccessToken({
      iss: settings.issuer,
      key: settings.keys.sig.pub,
      scope: 'realm'
    })
  ]

  /**
   * PATCH /v1/userpassword/:id
   */

  server.patch('/v1/userpassword/:id', authorize, function (req, res, next) {
    User.changePassword(req.params.id, req.body.password, function (err, user) {
      if (err) { return next(err) }
      if (!user) { return next(new NotFoundError()) }
      res.json(user)
    })
  })
}
