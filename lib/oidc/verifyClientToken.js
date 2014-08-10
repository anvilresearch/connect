/**
 * Module dependencies
 */

var ClientToken       = require('../../models/ClientToken')
  , UnauthorizedError = require('../../errors/UnauthorizedError')
  ;


/**
 * Client Bearer Token Authentication Middleware
 */

module.exports = function (server) {

  return function verifyClientToken (req, res, next) {
    var header = req.headers['authorization'];

    // missing header
    if (!header) {
      return next(new UnauthorizedError({
        realm:              'client',
        error:              'unauthorized_client',
        error_description:  'Missing authorization header',
        statusCode:         403
      }));
    }

    // header found
    else {
      var jwt   = header.replace('Bearer ', '')
        , token = ClientToken.decode(jwt, server.settings.publicKey)
        ;

      // failed to decode
      if (!token || token instanceof Error) {
        next(new UnauthorizedError({
          realm:              'client',
          error:              'unauthorized_client',
          error_description:  'Invalid access token',
          statusCode:         403
        }));

      }

      // decoded successfully
      else {
        // validate token
        req.token = token
        next()
      }
    }
  };
};

