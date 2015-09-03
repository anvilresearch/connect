/**
 * Module dependencies
 */

var Client = require('../models/Client')
var AuthorizationError = require('../errors/AuthorizationError')

/**
 * Verify Client
 *
 * This route-specific middleware retrieves a registered client and adds it
 * to the request object for use downstream. It verifies that the client is
 * registered and that the redirect_uri parameter matches the configuration
 * of the registered client.
 */

function verifyClient (req, res, next) {
  var params = req.connectParams

  Client.get(params.client_id, {
    private: true
  }, function (err, client) {
    if (err) { return next(err) }

    // The client must be registered.
    if (!client) {
      return next(new AuthorizationError({
        error: 'unauthorized_client',
        error_description: 'Unknown client',
        statusCode: 401
      }))
    }

    // Make client available to downstream middleware.
    req.client = client

    // Redirect URI must be configured for this client.
    if (client.redirect_uris.indexOf(params.redirect_uri) === -1) {
      return next(new AuthorizationError({
        error: 'invalid_request',
        error_description: 'Mismatching redirect uri',
        statusCode: 400
      }))
    }

    var responseTypes = params.response_type.trim().split(' ')

    // Response type must be configured for this client.
    var isRegisteredResponseType = Array.isArray(client.response_types) ?
      client.response_types.some(function (responseTypeString) {
        var responseTypeSet = responseTypeString.split(' ')
        return responseTypes.length === responseTypeSet.length &&
          responseTypes.every(function (responseType) {
            return responseTypeSet.indexOf(responseType) !== -1
          })
      }) :
      (responseTypes.length === 1 && responseTypes[0] === 'code')

    if (!isRegisteredResponseType) {
      return next(new AuthorizationError({
        error: 'unsupported_response_type',
        error_description: 'Unsupported response type',
        redirect_uri: params.redirect_uri,
        statusCode: 302
      }))
    }

    next()
  })
}

/**
 * Exports
 */

module.exports = verifyClient
