/**
 * Module dependencies
 */

var IDToken           = require('../../models/IDToken')
  , AccessToken       = require('../../models/AccessToken')
  , UnauthorizedError = require('../../errors/UnauthorizedError')
  ;


/**
 * Verify Client Registration
 */

function verifyClientRegistration (server) {

  return function (req, res, next) {

    // check if we have a token and a token is required
    var registration    = req.body
      , clientRegType   = server.settings.client_registration
      , authorization   = req.headers.authorization
      , tokenRequired   = (registration.trusted || clientRegType !== 'dynamic')
      , trustedRegScope = server.settings.trusted_registration_scope
      , regScope        = server.settings.registration_scope
      ;


    // can't continue because we don't have a token
    if (!authorization && tokenRequired) {
      return next(new UnauthorizedError({
        realm:             'user',
        error:              'invalid_request',
        error_description:  'Missing access token',
        statusCode:         400
      }));
    }


    // process a JWT access token
    if (authorization && authorization.indexOf('.') !== -1) {

      // decode the token
      var jwt   = authorization.replace('Bearer ', '')
        , token = IDToken.decode(jwt, server.settings.publicKey)
        , scope = token && token.payload && token.payload.scope
        ;

      // do not continue with an invalid token
      if (!token || token instanceof Error) {
        return next(new UnauthorizedError({
          realm:              'user',
          error:              'invalid_token',
          error_description:  'Invalid access token',
          statusCode:          401
        }));
      }

      // verify the trusted registration scope
      if (registration.trusted && !hasScope(token.payload, trustedRegScope)){
        return next(new UnauthorizedError({
          realm:              'user',
          error:              'insufficient_scope',
          error_description:  'User does not have permission',
          statusCode:          403
        }));
      }

      // verify the registration scope
      if (!registration.trusted
          && clientRegType === 'scoped' && !hasScope(token.payload, regScope)) {
        return next(new UnauthorizedError({
          realm:              'user',
          error:              'insufficient_scope',
          error_description:  'User does not have permission',
          statusCode:          403
        }));
      }

      // VALIDATE THE REST OF THE PAYLOAD, e.g., `exp`, etc.

      req.token = token.payload;

      return next();
    }

    // non-JWT access token
    else if (authorization) {

      AccessToken.get(authorization.replace('Bearer ', ''), function (err, at) {
        if (err) { return next(err); }

        // Unknown token
        if (!at) {
          return next(new UnauthorizedError({
            realm: 'user',
            error: 'invalid_token',
            error_description: 'Unknown access token',
            statusCode: 401
          }));
        }

        // verify the trusted registration scope
        if (registration.trusted && !hasScope(at, trustedRegScope)){
          return next(new UnauthorizedError({
            realm:              'user',
            error:              'insufficient_scope',
            error_description:  'User does not have permission',
            statusCode:          403
          }));
        }

        // verify the registration scope
        if (!registration.trusted
            && clientRegType === 'scoped' && !hasScope(at, regScope)) {
          return next(new UnauthorizedError({
            realm:              'user',
            error:              'insufficient_scope',
            error_description:  'User does not have permission',
            statusCode:          403
          }));
        }

        req.token = at

        return next();

      });

    }

    // authorization not required/provided
    else {
      next();
    }
  };


  function hasScope (token, scope) {
    var tscope = token && token.scope

    // false if there's no scope
    if (!tscope) { return false; }

    // split the values if they're strings
    if (typeof tscope === 'string') { tscope = tscope.split(' ') }

    // check if the token has any of the prescribed scope values
    return tscope.some(function (s) {
      return (scope.indexOf(s) !== -1) ? true : false;
    });
  }

}


/**
 * Exports
 */

module.exports = verifyClientRegistration;
