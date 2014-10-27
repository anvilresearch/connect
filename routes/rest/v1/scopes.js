/**
 * Module dependencies
 */

var Scope         = require('../../../models/Scope')
  , NotFoundError = require('../../../errors/NotFoundError')
  , oidc          = require('../../../lib/oidc')
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
   * GET /v1/scopes
   */

  server.get('/v1/scopes', authorize, function (req, res, next) {
    Scope.list({
      // options
    }, function (err, instances) {
      if (err) { return next(err); }
      res.json(instances);
    });
  });


  /**
   * GET /v1/scopes/:id
   */

  server.get('/v1/scopes/:id', authorize, function (req, res, next) {
    Scope.get(req.params.id, function (err, instance) {
      if (err) { return next(err); }
      if (!instance) { return next(new NotFoundError()); }
      res.json(instance);
    });
  });


  /**
   * POST /v1/scopes
   */

  server.post('/v1/scopes', authorize, function (req, res, next) {
    Scope.insert(req.body, function (err, instance) {
      if (err) { return next(err); }
      res.json(201, instance);
    });
  });


  /**
   * PATCH /v1/scopes/:id
   */

  server.patch('/v1/scopes/:id', authorize, function (req, res, next) {
    Scope.patch(req.params.id, req.body, function (err, instance) {
      if (err) { return next(err); }
      if (!instance) { return next(new NotFoundError()); }
      res.json(instance);
    });
  });


  /**
   * DELETE /v1/scopes/:id
   */

  server.del('/v1/scopes/:id', authorize, function (req, res, next) {
    Scope.delete(req.params.id, function (err, result) {
      if (err) { return next(err); }
      if (!result) { return next(new NotFoundError()); }
      res.send(204);
    });
  });


};
