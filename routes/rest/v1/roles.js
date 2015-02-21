/**
 * Module dependencies
 */

var Role         = require('../../../models/Role')
  , NotFoundError = require('../../../errors/NotFoundError')
  , oidc          = require('../../../oidc')
  ;

/**
 * Export
 */

module.exports = function (server) {

  /**
   * Token-based Auth Middleware
   */

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
   * GET /v1/roles
   */

  server.get('/v1/roles', authorize, function (req, res, next) {
    Role.list({
      // options
    }, function (err, instances) {
      if (err) { return next(err); }
      res.json(instances);
    });
  });


  /**
   * GET /v1/roles/:id
   */

  server.get('/v1/roles/:id', authorize, function (req, res, next) {
    Role.get(req.params.id, function (err, instance) {
      if (err) { return next(err); }
      if (!instance) { return next(new NotFoundError()); }
      res.json(instance);
    });
  });


  /**
   * POST /v1/roles
   */

  server.post('/v1/roles', authorize, function (req, res, next) {
    Role.insert(req.body, function (err, instance) {
      if (err) { return next(err); }
      res.json(201, instance);
    });
  });


  /**
   * PATCH /v1/roles/:id
   */

  server.patch('/v1/roles/:id', authorize, function (req, res, next) {
    Role.patch(req.params.id, req.body, function (err, instance) {
      if (err) { return next(err); }
      if (!instance) { return next(new NotFoundError()); }
      res.json(instance);
    });
  });


  /**
   * DELETE /v1/roles/:id
   */

  server.del('/v1/roles/:id', authorize, function (req, res, next) {
    Role.delete(req.params.id, function (err, result) {
      if (err) { return next(err); }
      if (!result) { return next(new NotFoundError()); }
      res.send(204);
    });
  });


};
