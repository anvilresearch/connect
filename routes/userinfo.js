/**
 * Module dependencies
 */

var oidc = require('../oidc')
var settings = require('../boot/settings')
var User = require('../models/User')
var NotFoundError = require('../errors/NotFoundError')

/**
 * Exports
 */

module.exports = function (server) {
  /**
   * UserInfo Endpoint
   */

  server.get('/userinfo',
    oidc.parseAuthorizationHeader,
    oidc.getBearerToken,
    oidc.verifyAccessToken({
      iss: settings.issuer,
      key: settings.keys.sig.pub,
      scope: 'profile'
    }),
    function (req, res, next) {
      User.get(req.claims.sub, function (err, user) {
        if (err) { return next(err) }
        if (!user) { return next(new NotFoundError()) }
        res.status(200).json(user.project('userinfo'))
      })
    })

}
