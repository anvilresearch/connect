/**
 * Module dependencies
 */

var AccessToken       = require('../../models/AccessToken')
  , UnauthorizedError = require('../../errors/UnauthorizedError')
  ;


/**
 * Verify User Token
 *
 * NOTE:
 * Requires `parseAuthorizationHeader` and `getBearerToken` upstream.
 */

function verifyUserToken (server, scope) {
  return function (req, res, next) {
    var token = req.bearer;

    // missing header
    if (!token) {
      return next(new UnauthorizedError({
        realm:             'user',
        error:             'invalid_request',
        error_description: 'An access token is required',
        statusCode:        400
      }));
    }

    // header found
    else {
      AccessToken.verify(token, {
        iss:    server.settings.issuer,
        key:    server.settings.publicKey,
        scope:  scope
      }, function (err, claims) {
        if (err) { return next(err); }
        req.token = claims;
        return next();
      });
    }
  };
}


/**
 * Exports
 */

module.exports = verifyUserToken;
