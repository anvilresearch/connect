/**
 * Module dependencies
 */

var settings = require('../boot/settings')
  , oidc = require('../oidc')
  ;


/**
 * Token Endpoint
 */

module.exports = function (server) {

  server.get('/jwks',
    function (req, res, next) {
      res.json(settings.jwks);
    }
  );

};

