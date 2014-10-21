/**
 * Module dependencies
 */

var oidc = require('../lib/oidc');


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

