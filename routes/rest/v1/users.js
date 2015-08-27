/**
 * Module dependencies
 */

var User = require('../../../models/User')
var NotFoundError = require('../../../errors/NotFoundError')
var settings = require('../../../boot/settings')
var oidc = require('../../../oidc')

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
      iss: settings.issuer,
      key: settings.keys.sig.pub,
      scope: 'realm'
    })
  ]

  /**
   * GET /v1/users
   */

  server.get('/v1/users', authorize, function (req, res, next) {
    User.list({
      // options
    }, function (err, instances) {
      if (err) { return next(err) }
      res.json(instances)
    })
  })

  /**
   * GET /v1/users/:id
   */

  server.get('/v1/users/:id', authorize, function (req, res, next) {
    User.get(req.params.id, function (err, instance) {
      if (err) { return next(err) }
      if (!instance) { return next(new NotFoundError()) }
      res.json(instance)
    })
  })

  /**
   * POST /v1/users
   */

  server.post('/v1/users', authorize, function (req, res, next) {
    User.insert(req.body, function (err, instance) {
      if (err) { return next(err) }
      res.status(201).json(instance)
    })
  })

  /**
   * PATCH /v1/users/:id
   */

  server.patch('/v1/users/:id', authorize, function (req, res, next) {
    User.patch(req.params.id, req.body, function (err, instance) {
      if (err) { return next(err) }
      if (!instance) { return next(new NotFoundError()) }
      res.json(instance)
    })
  })

  /**
   * DELETE /v1/users/:id
   */

  server.delete('/v1/users/:id', authorize, function (req, res, next) {
    User.delete(req.params.id, function (err, result) {
      if (err) { return next(err) }
      if (!result) { return next(new NotFoundError()) }
      res.sendStatus(204)
    })
  })

}
