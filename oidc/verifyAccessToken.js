/**
 * Module dependencies
 */

var AccessToken = require('../models/AccessToken')
var UnauthorizedError = require('../errors/UnauthorizedError')

/**
 * Verify User Token
 *
 * NOTE:
 * Requires `parseAuthorizationHeader` and `getBearerToken` upstream.
 *
 *
 * Options:
 * - required
 * - iss
 * - key
 * - scope
 */

function verifyAccessToken (options) {
  return function (req, res, next) {
    var token = req.bearer

    // missing token
    if (!token && options.required !== false) {
      return next(new UnauthorizedError({
        realm: 'user',
        error: 'invalid_request',
        error_description: 'An access token is required',
        statusCode: 400
      }))

    // token found
    } else if (token) {
      AccessToken.verify(token, options, function (err, claims) {
        if (err) { return next(err) }
        req.claims = claims
        return next()
      })

    // token not required
    } else {
      req.claims = {}
      return next()
    }
  }
}

/**
 * Exports
 */

module.exports = verifyAccessToken
