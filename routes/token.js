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
    oidc.verifyClientToken(server),
    oidc.verifyAuthorizationCode,
    oidc.token
  );

};

