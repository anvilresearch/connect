/**
 * Module dependencies
 */

var oidc = require('../oidc')
var settings = require('../boot/settings')
var User = require('../models/User')
var Scope = require('../models/Scope')
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

    // Get the scopes authorized for the verified and decoded token
    function (req, res, next) {
      var scopeNames = req.claims.scope && req.claims.scope.split(' ')

      Scope.get(scopeNames, function (err, scopes) {
        if (err) { return next(err) }
        req.scopes = scopes
        next()
      })
    },

    // Respond with userinfo based on authorized scopes
    function (req, res, next) {
      User.get(req.claims.sub, function (err, user) {
        if (err) { return next(err) }
        if (!user) { return next(new NotFoundError()) }

        var userInfo = {}
        var projection = user.project('userinfo')

        req.scopes.forEach(function (scope) {
          scope.attributes && scope.attributes.user && scope.attributes.user.forEach(function (key) {
            if (typeof projection[key] !== 'undefined') {
              userInfo[key] = projection[key]
            }
          })
        })

        res.status(200).json(userInfo)
      })
    })
}
