/**
 * Module dependencies
 */

var User = require('../../../models/User')
  , oidc = require('../../../lib/oidc')
  ;

/**
 * Export
 */

module.exports = function (server) {

  server.get('/v1/users',
    oidc.parseAuthorizationHeader,
    oidc.getBearerToken,
    oidc.verifyAccessToken({
      iss:    server.settings.issuer,
      key:    server.settings.publicKey,
      scope: 'realm'
    }),
    function (req, res, next) {
      User.list({
        // options
      }, function (err, users) {
        if (err) { return next(err); }
        res.json(users);
      });
    });

};
