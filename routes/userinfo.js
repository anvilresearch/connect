/**
 * Module dependencies
 */

var oidc     = require('../oidc')
  , settings = require('../boot/settings')
  , User     = require('../models/User')
  ;


/**
 * Exports
 */

module.exports = function (server) {

  /**
   * UserInfo Endpoint
   */

  server.get('/userinfo',
    oidc.parseAuthorizationHeader,
    oidc.getBearerToken,
    oidc.verifyAccessToken({
      iss:    settings.issuer,
      key:    settings.publicKey,
      scope: 'profile'
    }),
    function (req, res, next) {
      User.get(req.claims.sub, function (err, user) {
        if (err)   { return next(err); }
        if (!user) { return next(new NotFoundError()); }
        res.status(200).json(user.project('userinfo'));
      });
    });

};

