/**
 * Module dependencies
 */

var oidc = require('../oidc');


/**
 * Token Endpoint
 */

module.exports = function (server) {

  server.post('/token',
    oidc.selectConnectParams,
    oidc.validateTokenParams,
    oidc.authenticateClient,
    oidc.verifyAuthorizationCode,
    oidc.determineClientScope,
    oidc.token(server)
  );

};

