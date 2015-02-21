/**
 * Module dependencies
 */

var oidc = require('../oidc');


/**
 * Token Endpoint
 */

module.exports = function (server) {

  server.all('/token/verify',
    oidc.authenticateClient,
    oidc.parseAuthorizationHeader,
    oidc.getBearerToken,
    oidc.verifyAccessToken({
      iss: server.settings.issuer,
      key: server.settings.publicKey
    }),
    function (req, res, next) {

      // don't cache this response
      res.set({
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache'
      });

      // respond with decoded/retrieved claims
      res.json(req.claims);
    }
  );

};

