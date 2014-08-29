/**
 * Module dependencies
 */

var oidc = require('../lib/oidc');


/**
 * Token Endpoint
 */

module.exports = function (server) {

  server.get('/jwks',
    oidc.authenticateClient,
    function (req, res, next) {
      res.json(server.settings.jwks);
    }
  );

};

