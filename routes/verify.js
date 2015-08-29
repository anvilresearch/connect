/**
 * Module dependencies
 */

var oidc = require('../oidc')
var settings = require('../boot/settings')

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
      key: settings.keys.sig.pub
    }),
    function (req, res, next) {
      // don't cache this response
      res.set({
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache'
      })

      // respond with decoded/retrieved claims
      res.json(req.claims)
    }
  )

}
