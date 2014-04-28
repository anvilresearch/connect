/**
 * Module dependencies
 */

var oidc = require('../lib/oidc');


/**
 * Authorize Endpoint
 */

module.exports = function (server) {

  server.get('/authorize',
    oidc.selectConnectParams,
    oidc.validateAuthorizationParams,
    oidc.verifyClient,
    oidc.requireSignin,
    oidc.determineScope,
    oidc.promptToAuthorize,
    oidc.authorize(server)
  );

  server.post('/authorize',
    oidc.selectConnectParams,
    oidc.validateAuthorizationParams,
    oidc.verifyClient,
    oidc.requireSignin,
    oidc.determineScope,
    oidc.promptToAuthorize,
    oidc.authorize(server)
  );

};
