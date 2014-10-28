/**
 * Module dependencies
 */

var User          = require('../../../models/User')
  , Role          = require('../../../models/Role')
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
   * GET /v1/users/:userId/roles
   */

  server.get('/v1/users/:userId/roles',
    authorize,
    function (req, res, next) {

      // first, ensure the account exists
      User.get(req.params.userId, function (err, instance) {
        if (err) { return next(err); }
        if (!instance) { return next(new NotFoundError()); }

        // then list roles by account
        Role.listByUsers(req.params.userId, function (err, instances) {
          if (err) { return next(err); }
          res.json(instances);
        });
      });
    });


  /**
   * PUT /v1/users/:userId/roles/:roleId
   */

  server.put('/v1/users/:userId/roles/:roleId',
    authorize,
    function (req, res, next) {
      User.get(req.params.userId, function (err, instance) {
        if (err)       { return next(err); }
        if (!instance) { return next(new NotFoundError()); }

        Role.get(req.params.roleId, function (err, role) {
          if (err) { return next(err); }
          if (!role) { return next(new NotFoundError()); }

          instance.addRoles(req.params.roleId, function (err, result) {
            if (err) { return next(err); }
            res.json({ added: true });
          });
        });
      });
    });


  /**
   * DELETE /v1/users/:userId/roles/:roleId
   */

  server.del('/v1/users/:userId/roles/:roleId',
    authorize,
    function (req, res, next) {
      User.get(req.params.userId, function (err, instance) {
        if (err)       { return next(err); }
        if (!instance) { return next(new NotFoundError()); }

        instance.removeRoles(req.params.roleId, function (err, result) {
          if (err) { return next(err); }
          res.send(204);
        });
      });
    });


};
