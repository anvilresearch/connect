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
    oidc.verifyUserToken(server, 'profile'),
    function (req, res, next) {
      User.get(req.token.sub, function (err, user) {
        if (err)   { return next(err); }
        if (!user) { return next(new NotFoundError()); }
        res.json(200, user.project('userinfo'));
      });
    });

};

