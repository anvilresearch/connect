/**
 * Module dependencies
 */

var UnauthorizedError = require('../errors/UnauthorizedError')

/**
 * Parse Authorization Header
 */

function parseAuthorizationHeader (req, res, next) {
  // parse the header if it's present in the request
  if (req.headers && req.headers.authorization) {
    var components = req.headers.authorization.split(' ')
    var scheme = components[0]
    var credentials = components[1]

    // ensure the correct number of components
    if (components.length !== 2) {
      return next(new UnauthorizedError({
        error: 'invalid_request',
        error_description: 'Invalid authorization header',
        statusCode: 400
      }))
    }

    // ensure the scheme is valid
    if (!scheme.match(/Basic|Bearer|Digest/i)) {
      return next(new UnauthorizedError({
        error: 'invalid_request',
        error_description: 'Invalid authorization scheme',
        statusCode: 400
      }))
    }

    req.authorization = {
      scheme: scheme,
      credentials: credentials
    }

  // otherwise add an empty authorization object
  } else {
    req.authorization = {}
  }

  next()
}

/**
 * Exports
 */

module.exports = parseAuthorizationHeader
