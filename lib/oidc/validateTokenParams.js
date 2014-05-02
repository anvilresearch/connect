/**
 * Module dependencies
 */

var AuthorizationError = require('../../errors/AuthorizationError');


/**
 * Supported grant types
 */

var grantTypes = [
  'authorization_code', 'refresh_token'
];


/**
 * Validate token parameters
 */

function validateTokenParams (req, res, next) {
  var params = req.body;

  // missing grant type
  if (!params.grant_type) {
    return next(new AuthorizationError({
      error: 'invalid_request',
      error_description: 'Missing grant type',
      statusCode: 400
    }));
  }

  // unsupported grant type
  if (grantTypes.indexOf(params.grant_type) === -1) {
    return next(new AuthorizationError({
      error: 'unsupported_grant_type',
      error_description: 'Unsupported grant type',
      statusCode: 400
    }));
  }

  // missing authorization code
  if (params.grant_type === 'authorization_code' && !params.code) {
    return next(new AuthorizationError({
      error: 'invalid_request',
      error_description: 'Missing authorization code',
      statusCode: 400
    }));
  }

  // missing redirect uri
  if (params.grant_type === 'authorization_code' && !params.redirect_uri) {
    return next(new AuthorizationError({
      error: 'invalid_request',
      error_description: 'Missing redirect uri',
      statusCode: 400
    }));
  }

  // missing refresh token
  if (params.grant_type === 'refresh_token' && !params.refresh_token) {
    return next(new AuthorizationError({
      error: 'invalid_request',
      error_description: 'Missing refresh token',
      statusCode: 400
    }));
  }

  next();
}


/**
 * Exports
 */

module.exports = validateTokenParams;
