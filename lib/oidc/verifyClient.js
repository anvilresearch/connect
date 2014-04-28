/**
 * Module dependencies
 */

var Client = require('../../models/Client')
  , AuthorizationError = require('../../errors/AuthorizationError')
  ;

/**
 * Verify Client
 *
 * This route-specific middleware retrieves a registered client and adds it
 * to the request object for use downstream. It verifies that the client is
 * registered and that the redirect_uri parameter and origin of the request
 * matches the configuration of the registered client. If the client is
 * confidential, it must also be authenticated via Signed JWT Bearer Token.
 */

function verifyClient (req, res, next) {
  var params = req.connectParams;

  Client.get(params.client_id, {
    private: true
  }, function (err, client) {
    if (err) { return next(err); }

    // The client must be registered.
    if (!client) {
      return next(new AuthorizationError({
        error: 'unauthorized_client',
        error_description: 'Unknown client',
        statusCode: 401
      }));
    }

    // Make client available to downstream middleware.
    req.client = client;

    // Redirect URI must be configured for this client.
    if (client.redirect_uris.indexOf(params.redirect_uri) === -1) {
      return next(new AuthorizationError({
        error: 'invalid_request',
        error_description: 'Mismatching redirect uri',
        statusCode: 400
      }));
    }

    // Confidential clients must authenticate.
    if (client.type === 'confidential') {
      var jwt = req.headers['Authorization'].replace('Bearer', '');

      // JWT Bearer token credentials must be provided.
      if (!jwt) {
        return next(new AuthorizationError({
          error: 'unauthorized_client',
          error_description: 'Missing client credentials',
          statusCode: 401
        }));
      }

      // Verify the JWT Signature
      if (!jwt = ClientToken.decode(jwt, client.publicKey)) {
        return next(new AuthorizationError({
          error: 'unauthorized_client',
          error_description: 'Invalid client credentials',
          statusCode: 401
        }));
      }

      // Validate the "iss"
      if (client.hosts.indexOf(jwt.payload.iss) === -1) {
        return next(new AuthorizationError({
          error: 'unauthorized_client',
          error_description: 'Invalid client credentials',
          statusCode: 401
        }));
      }

      // Validate the "sub"
      if (jwt.payload.sub !== client._id) {
        return next(new AuthorizationError({
          error: 'unauthorized_client',
          error_description: 'Invalid client credentials',
          statusCode: 401
        }));
      }

      // Validate the "aud"
      if (jwt.payload.aud !== server.settings.host) {
        return next(new AuthorizationError({
          error: 'unauthorized_client',
          error_description: 'Invalid client credentials',
          statusCode: 401
        }));
      }
    }

    // Match the request origin to configured hosts
    //if (client.hosts.indexOf(req.connection.remoteAddr) === -1) {
    //  return next(new AuthorizationError({
    //    error: 'unauthorized_client',
    //    error_description: 'Invalid host',
    //    statusCode: 401
    //  }));
    //}

    next();
  });
}


/**
 * Exports
 */

module.exports = verifyClient;
