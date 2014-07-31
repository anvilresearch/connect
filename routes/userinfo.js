var oidc = require('../lib/oidc')
  , User = require('../models/User')
  ;


module.exports = function (server) {

  /**
   * UserInfo Endpoint
   */

  server.get('/userinfo',
    oidc.parseAuthorizationHeader,
    oidc.getBearerToken,
    oidc.verifyAccessToken({
      iss:    server.settings.issuer,
      key:    server.settings.publicKey,
      scope: 'profile'
    }),
    function (req, res, next) {
      User.get(req.claims.sub, function (err, user) {
        if (err)   { return next(err); }
        if (!user) { return next(new NotFoundError()); }
        res.json(200, user.project('userinfo'));
      });
    });

};

