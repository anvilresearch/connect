/**
 * Module dependencies
 */

var oidc     = require('../oidc')
  , settings = require('../boot/settings')
  ;


/**
 * Token Endpoint
 */

module.exports = function (server) {

  server.all('/token/verify',
    oidc.authenticateClient,
    oidc.parseAuthorizationHeader,
    oidc.getBearerToken,
    oidc.verifyAccessToken({
      iss: settings.issuer,
      key: settings.publicKey
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

