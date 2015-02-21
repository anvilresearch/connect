/**
 * Module dependencies
 */

var UnauthorizedError = require('../errors/UnauthorizedError');


/**
 * Get Bearer Token
 *
 * NOTE:
 * This middleware assumes parseAuthorizationHeader has been invoked upstream.
 */

function getBearerToken (req, res, next) {

  // check for access token in the authorization header
  if (req.authorization.scheme && req.authorization.scheme.match(/Bearer/i)) {
    req.bearer = req.authorization.credentials;
  }

  // check for access token in the query params
  if (req.query && req.query.access_token) {
    if (req.bearer) {
      return next(new UnauthorizedError({
        error:              'invalid_request',
        error_description:  'Multiple authentication methods',
        statusCode:          400
      }));
    }

    req.bearer = req.query.access_token;
  }

  // check for access token in the request body
  if (req.body && req.body.access_token) {
    if (req.bearer) {
      return next(new UnauthorizedError({
        error:              'invalid_request',
        error_description:  'Multiple authentication methods',
        statusCode:          400
      }));
    }

    if (req.headers
     && req.headers['content-type'] !== 'application/x-www-form-urlencoded') {
      return next(new UnauthorizedError({
        error:              'invalid_request',
        error_description:  'Invalid content-type',
        statusCode:          400
      }));
    }

    req.bearer = req.body.access_token;
  }

  next();
}


/**
 * Export
 */

module.exports = getBearerToken;
