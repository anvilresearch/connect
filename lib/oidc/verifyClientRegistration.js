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
      , authorization   = req.bearer
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

    // we have a token, so let's verify it
    if (authorization) {

      AccessToken.verify(authorization, {
        iss: server.settings.issuer,
        key: server.settings.publicKey
      }, function (err, claims) {
        if (err) { return next(err); }

        // verify the trusted registration scope
        if (registration.trusted && !hasScope(claims, trustedRegScope)){
          return next(new UnauthorizedError({
            realm:              'user',
            error:              'insufficient_scope',
            error_description:  'User does not have permission',
            statusCode:          403
          }));
        }

        // verify the registration scope
        if (!registration.trusted
            && clientRegType === 'scoped' && !hasScope(claims, regScope)) {
          return next(new UnauthorizedError({
            realm:              'user',
            error:              'insufficient_scope',
            error_description:  'User does not have permission',
            statusCode:          403
          }));
        }

        next();
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
