/**
 * Module dependencies
 */

var oidc = require('../oidc');


/**
 * Token Endpoint
 */

module.exports = function (server) {

  server.get('/jwks',
    function (req, res, next) {
      res.json(server.settings.jwks);
    }
  );

};

