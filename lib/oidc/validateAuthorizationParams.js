/**
 * Module dependencies
 */

var AuthorizationError = require('../../errors/AuthorizationError');


/**
 * Supported response types
 */

var responseTypes = [
  'code',
  'id_token',
  'id_token token'
];


/**
 * Validate Authorization Parameters
 *
 * Ensures that `response_type`, `redirect_uri`, and `client_id` are included in
 * request parameters, and that `response_type` is supported.
 */

function validateAuthorizationParams (req, res, next) {
  var params = req.connectParams;

  // missing redirect uri
  if (!params.redirect_uri) {
    return next(new AuthorizationError({
      error: 'invalid_request',
      error_description: 'Missing redirect uri',
      statusCode: 400
    }));
  }

  // invalid redirect uri
  //if (!params.redirect_uri) {     // HOW SHOULD WE VALIDATE THIS?
  //  return next(new AuthorizationError({
  //    error: 'invalid_request',
  //    error_description: 'Invalid redirect uri',
  //    statusCode: 400
  //  }));
  //}

  // missing response type
  if (!params.response_type) {
    return next(new AuthorizationError({
      error: 'invalid_request',
      error_description: 'Missing response type',
      redirect_uri: params.redirect_uri,
      statusCode: 302
    }));
  }

  // unsupported response type
  if (responseTypes.indexOf(params.response_type) === -1) {
    return next(new AuthorizationError({
      error: 'unsupported_response_type',
      error_description: 'Unsupported response type',
      redirect_uri: params.redirect_uri,
      statusCode: 302
    }));
  }

  // missing client id
  if (!params.client_id) {
    return next(new AuthorizationError({
      error: 'unauthorized_client',
      error_description: 'Missing client id',
      statusCode: 403
    }));
  }

  // missing scope
  if (!params.scope) {
    return next(new AuthorizationError({
      error: 'invalid_scope',
      error_description: 'Missing scope',
      redirect_uri: params.redirect_uri,
      statusCode: 302
    }));
  }

  // missing openid scope
  if (params.scope.indexOf('openid') === -1) {
    return next(new AuthorizationError({
      error: 'invalid_scope',
      error_description: 'Missing openid scope',
      redirect_uri: params.redirect_uri,
      statusCode: 302
    }));
  }

  next();
}


/**
 * Exports
 */

module.exports = validateAuthorizationParams;
