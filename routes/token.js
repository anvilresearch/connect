/**
 * Module dependencies
 */

var oidc = require('../lib/oidc');


/**
 * Token Endpoint
 */

module.exports = function (server) {

  server.post('/token',
    oidc.selectConnectParams,
    oidc.validateTokenParams,
    oidc.authenticateClient,
    oidc.verifyAuthorizationCode,
    oidc.token(server)
  );

};

