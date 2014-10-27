/**
 * Module dependencies
 */

var Client          = require('../../../models/Client')
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
   * GET /v1/clients
   */

  server.get('/v1/clients', authorize, function (req, res, next) {
    Client.list({
      // options
    }, function (err, instances) {
      if (err) { return next(err); }
      res.json(instances);
    });
  });


  /**
   * GET /v1/clients/:id
   */

  server.get('/v1/clients/:id', authorize, function (req, res, next) {
    Client.get(req.params.id, function (err, instance) {
      if (err) { return next(err); }
      if (!instance) { return next(new NotFoundError()); }
      res.json(instance);
    });
  });


  /**
   * POST /v1/clients
   */

  server.post('/v1/clients', authorize, function (req, res, next) {
    Client.insert(req.body, function (err, instance) {
      if (err) { return next(err); }
      res.json(201, instance);
    });
  });


  /**
   * PATCH /v1/clients/:id
   */

  server.patch('/v1/clients/:id', authorize, function (req, res, next) {
    Client.patch(req.params.id, req.body, function (err, instance) {
      if (err) { return next(err); }
      if (!instance) { return next(new NotFoundError()); }
      res.json(instance);
    });
  });


  /**
   * DELETE /v1/clients/:id
   */

  server.del('/v1/clients/:id', authorize, function (req, res, next) {
    Client.delete(req.params.id, function (err, result) {
      if (err) { return next(err); }
      if (!result) { return next(new NotFoundError()); }
      res.send(204);
    });
  });


};
