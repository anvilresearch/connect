/**
 * Module dependencies
 */

var User          = require('../../../models/User')
  , NotFoundError = require('../../../errors/NotFoundError')
  , oidc          = require('../../../lib/oidc')
  ;

/**
 * Export
 */

module.exports = function (server) {

  var authorize = [
    oidc.parseAuthorizationHeader,
    oidc.getBearerToken,
    oidc.verifyAccessToken({
      iss:    server.settings.issuer,
      key:    server.settings.publicKey,
      scope: 'realm'
    })
  ];


  /**
   * GET /v1/users
   */

  server.get('/v1/users', authorize, function (req, res, next) {
    User.list({
      // options
    }, function (err, instances) {
      if (err) { return next(err); }
      res.json(instances);
    });
  });


  /**
   * GET /v1/users/:id
   */

  server.get('/v1/users/:id', authorize, function (req, res, next) {
    User.get(req.params.id, function (err, instance) {
      if (err) { return next(err); }
      if (!instance) { return next(new NotFoundError()); }
      res.json(instance);
    });
  });


  /**
   * POST /v1/users
   */

  server.post('/v1/users', authorize, function (req, res, next) {
    User.insert(req.body, function (err, instance) {
      if (err) { return next(err); }
      res.json(201, instance);
    });
  });

};
