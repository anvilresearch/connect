/**
 * Module dependencies
 */

var oidc = require('../lib/oidc')
  , AccessToken = require('../models/AccessToken')
  , InvalidTokenError = require('../errors/InvalidTokenError')
  ;


/**
 * Token Endpoint
 */

module.exports = function (server) {

  // HOW IS THIS ENDPOINT DIFFERENT THAN GENERAL ACCESS TOKEN VERIFICATION?
  // WE'RE NOT ACTUALLY USING THE TOKEN TO GAIN ACCESS. WE'RE SENDING IT TO
  // BE VERIFIED WITH THE VERIFICATION BEING THE RESPONSE. SO IS IT APPROPRIATE
  // AND USEFUL TO RETURN THE SAME KINDS OF ERROR RESPONSES?

  function verifyAccessToken (req, res, next) {
    AccessToken.verify(req.bearer, server, function (err, claims) {
      if (err) {
        return next(err);
      }

      res.set({
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache'
      });

      res.json(claims);
    });
  }


  server.all('/token/verify',
    oidc.parseAuthorizationHeader,
    oidc.getBearerToken,
    oidc.authenticateClient,
    //oidc.verifyClientToken(server),
    verifyAccessToken
  );

};

