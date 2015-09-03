/**
 * Module dependencies
 */

var AuthorizationError = require('../errors/AuthorizationError')

/**
 * Supported response types
 */

var responseTypes = [
  'code', // authorization code flow
  'code token', // hybrid flow
  'code id_token', // hybrid flow
  'id_token', // implicit flow
  'token id_token', // implicit flow
  'id_token token', // implicit flow
  'code id_token token', // hybrid flow
  'none' //
]

/**
 * Supported response modes
 */

var responseModes = [
  'query',
  'fragment'
]

/**
 * Validate Authorization Parameters
 *
 * Ensures that `response_type`, `redirect_uri`, and `client_id` are included in
 * request parameters, and that `response_type` is supported.
 */

function validateAuthorizationParams (req, res, next) {
  var params = req.connectParams

  // missing response type
  if (!params.response_type) {
    return next(new AuthorizationError({
      error: 'invalid_request',
      error_description: 'Missing response type',
      redirect_uri: params.redirect_uri,
      statusCode: 302
    }))
  }

  // unsupported response type
  if (responseTypes.indexOf(params.response_type) === -1) {
    return next(new AuthorizationError({
      error: 'unsupported_response_type',
      error_description: 'Unsupported response type',
      redirect_uri: params.redirect_uri,
      statusCode: 302
    }))
  }

  // unsupported response mode
  if (params.response_mode &&
    responseModes.indexOf(params.response_mode) === -1) {
    return next(new AuthorizationError({
      error: 'unsupported_response_mode',
      error_description: 'Unsupported response mode',
      redirect_uri: params.redirect_uri,
      statusCode: 302
    }))
  }

  // missing scope
  if (!params.scope) {
    return next(new AuthorizationError({
      error: 'invalid_scope',
      error_description: 'Missing scope',
      redirect_uri: params.redirect_uri,
      statusCode: 302
    }))
  }

  // missing openid scope
  if (params.scope.indexOf('openid') === -1) {
    return next(new AuthorizationError({
      error: 'invalid_scope',
      error_description: 'Missing openid scope',
      redirect_uri: params.redirect_uri,
      statusCode: 302
    }))
  }

  // missing nonce
  if (requiresNonce(params.response_type) && !params.nonce) {
    return next(new AuthorizationError({
      error: 'invalid_request',
      error_description: 'Missing nonce',
      redirect_uri: params.redirect_uri,
      statusCode: 302
    }))
  }

  next()
}

/**
 * Check if a nonce is required
 */

function requiresNonce (responseType) {
  return (['id_token', 'id_token token'].indexOf(responseType) !== -1)
}

/**
 * Exports
 */

module.exports = validateAuthorizationParams
