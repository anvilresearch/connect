/**
 * Module dependencies
 */

var settings = require('../boot/settings')

/**
 * Token Endpoint
 */

module.exports = function (server) {
  server.get('/jwks',
    function (req, res, next) {
      res.json(settings.keys.jwks)
    }
  )
}
