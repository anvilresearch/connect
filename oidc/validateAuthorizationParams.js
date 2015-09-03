/**
 * Module dependencies
 */

var AuthorizationError = require('../errors/AuthorizationError')

/**
 * Supported response types
 */

var validResponseTypes = [
  'code',
  'token',
  'id_token',
  'none'
]

/**
 * Supported response modes
 */

var validResponseModes = [
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

  // missing redirect uri
  if (!params.redirect_uri) {
    return next(new AuthorizationError({
      error: 'invalid_request',
      error_description: 'Missing redirect uri',
      statusCode: 400
    }))
  }

  // invalid redirect uri
  // if (!params.redirect_uri) {     // HOW SHOULD WE VALIDATE THIS?
  //  return next(new AuthorizationError({
  //    error: 'invalid_request',
  //    error_description: 'Invalid redirect uri',
  //    statusCode: 400
  //  }))
  // }

  // missing response type
  if (!params.response_type) {
    return next(new AuthorizationError({
      error: 'invalid_request',
      error_description: 'Missing response type',
      redirect_uri: params.redirect_uri,
      statusCode: 302
    }))
  }

  var responseTypes = params.response_type.trim().split(' ')

  // Check that
  // - All response_types are valid
  // - If `none` response_type is given, that it is the only response_type
  var isValidResponseType = responseTypes.indexOf('none') !== -1 ?
    responseTypes.length === 1 :
    responseTypes.every(
      function (responseType) {
        return validResponseTypes.indexOf(responseType) !== -1
      }
    )

  // unsupported response type
  if (!isValidResponseType) {
    return next(new AuthorizationError({
      error: 'unsupported_response_type',
      error_description: 'Unsupported response type',
      redirect_uri: params.redirect_uri,
      statusCode: 302
    }))
  }

  // unsupported response mode
  if (params.response_mode &&
    validResponseModes.indexOf(params.response_mode) === -1) {
    return next(new AuthorizationError({
      error: 'unsupported_response_mode',
      error_description: 'Unsupported response mode',
      redirect_uri: params.redirect_uri,
      statusCode: 302
    }))
  }

  // missing client id
  if (!params.client_id) {
    return next(new AuthorizationError({
      error: 'unauthorized_client',
      error_description: 'Missing client id',
      statusCode: 403
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
  if (!params.nonce && requiresNonce(responseTypes)) {
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

function requiresNonce (responseTypes) {
  return responseTypes.some(function (responseType) {
    return responseType === 'id_token' || responseType === 'token'
  })
}

/**
 * Exports
 */

module.exports = validateAuthorizationParams
