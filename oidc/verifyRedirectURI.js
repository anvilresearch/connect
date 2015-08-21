/**
 * Module dependencies
 */

var Client = require('../models/Client')

/**
 * Verify Redirect URI
 *
 * This route-specific middleware retrieves a registered client and adds it
 * to the request object for use downstream. It verifies that the client is
 * registered and that the redirect_uri parameter matches the configuration
 * of the registered client.
 *
 * However, unlike the verifyClient middleware, this middleware will not
 * cause any errors, but instead remove the invalid values off of the
 * req.connectParams object.
 */

function verifyRedirectURI (req, res, next) {
  var params = req.connectParams

  Client.get(params.client_id, {
    private: true
  }, function (err, client) {
    if (err) { return next(err) }

    // The client must be registered.
    if (!client || client.redirect_uris.indexOf(params.redirect_uri) === -1) {
      delete req.connectParams.client_id
      delete req.connectParams.redirect_uri
      delete req.connectParams.response_type
      delete req.connectParams.scope
      return next()
    }

    // Make client available to downstream middleware.
    req.client = client

    next()
  })
}

/**
 * Exports
 */

module.exports = verifyRedirectURI
