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
    oidc.getAuthorizedScopes,

    // Respond with userinfo based on authorized scopes
    function (req, res, next) {
      User.get(req.claims.sub, function (err, user) {
        if (err) { return next(err) }
        if (!user) { return next(new NotFoundError()) }

        var projection = user.project('userinfo')
        var userInfo = { sub: projection.sub }

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

  /**
   * UserInfo Update Endpoint
   */

  server.patch('/userinfo',
    oidc.parseAuthorizationHeader,
    oidc.getBearerToken,
    oidc.verifyAccessToken({
      iss: settings.issuer,
      key: settings.keys.sig.pub,
      scope: 'profile'
    }),
    oidc.getAuthorizedScopes,

    // Map updates given in the request body to attributes in the scopes authorized by the access token.
    function (req, res, next) {
      var scopeUserAttributes = []
      var authorizedUpdates = {}
      req.scopes.forEach(function (scope) {
        scope.attributes && scope.attributes.user && scope.attributes.user.forEach(function (key) {
          scopeUserAttributes.push(key)
          if (req.body && req.body[key]) {
            authorizedUpdates[key] = req.body[key]
          }
        })
      })

      var options = { /*private: true*/ } // Not sure what to do here

      // Do the update and return the usual userinfo data after the update is complete.
      User.patch(req.claims.sub, authorizedUpdates, options, function (err, user) {
        if (err) { return next(err) }
        if (!user) { return next(new NotFoundError()) }

        
        var projection = user.project('userinfo')
        var userInfo = { sub: projection.sub }

        scopeUserAttributes.forEach(function (key) {
          if (typeof projection[key] !== 'undefined') {
            userInfo[key] = projection[key]
          }
        })

        res.status(200).json(userInfo)
      })
    })
}
