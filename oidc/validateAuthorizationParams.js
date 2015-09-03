/**
 * Module dependencies
 */

var settings = require('../boot/settings')
var AuthorizationError = require('../errors/AuthorizationError')

/**
 * Valid response types
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

  // missing response type
  if (!params.response_type || !params.response_type.trim()) {
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

  // invalid response type
  if (!isValidResponseType) {
    return next(new AuthorizationError({
      error: 'unsupported_response_type',
      error_description: 'Unsupported response type',
      redirect_uri: params.redirect_uri,
      statusCode: 302
    }))
  }

  // Check that there is at least one defined set of response_types that are
  // supported together in settings.
  //
  // For example, if the settings allow 'code', 'id_token token', and
  // 'code id_token token', then:
  //
  // - 'code' will pass
  // - 'id_token token' will pass
  // - 'code token id_token' will pass
  // - 'token' will NOT pass
  // - 'id_token code' will NOT pass
  var isSupportedResponseType = settings.response_types_supported
    .some(function (responseTypeString) {
      var responseTypeSet = responseTypeString.split(' ')
      return responseTypes.length === responseTypeSet.length &&
        responseTypes.every(function (responseType) {
          return responseTypeSet.indexOf(responseType) !== -1
        })
    })

  // unsupported response type
  if (!isSupportedResponseType) {
    return next(new AuthorizationError({
      error: 'unsupported_response_type',
      error_description: 'Unsupported response type',
      redirect_uri: params.redirect_uri,
      statusCode: 302
    }))
  }

  // unsupported response mode
  if (params.response_mode && params.response_mode.trim() &&
    validResponseModes.indexOf(params.response_mode.trim()) === -1) {
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
