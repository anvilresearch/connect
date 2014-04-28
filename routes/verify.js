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

  function verifyAccessToken (req, res, next) {
    var token = req.connectParams.access_token;

    AccessToken.get(token, function (err, at) {
      if (err) {
        return next(err);
      }

      if (!at) {
        return next(new InvalidTokenError('Unknown access token'));
      }

      var expiration = (at.created + (at.ei * 1000));

      if (Date.now() > expiration) {
        return next(new InvalidTokenError('Expired access token'));
      }

      res.set({
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache'
      });

      res.json({
        iss: server.settings.issuer,
        sub: at.uid,
        aud: at.cid,
        iat: at.created,
        exp: expiration,
        scope: at.scope
      });
    });
  }


  server.get('/token/verify',
    oidc.selectConnectParams,
    oidc.verifyClientToken(server),
    verifyAccessToken
  );


  server.post('/token/verify',
    oidc.selectConnectParams,
    oidc.verifyClientToken(server),
    verifyAccessToken
  );

};

