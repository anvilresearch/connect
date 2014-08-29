/**
 * Module dependencies
 */

var oidc = require('../lib/oidc');


/**
 * Authorize Endpoint
 */

module.exports = function (server) {
  var handler = [
    oidc.selectConnectParams,
    oidc.validateAuthorizationParams,
    oidc.verifyClient,
    oidc.requireSignin,
    oidc.determineScope,
    oidc.promptToAuthorize,
    oidc.authorize(server)
  ];

  if (oidc.beforeAuthorize) {
    handler.splice(handler.length - 1, 0, oidc.beforeAuthorize)
  }

  server.get('/authorize', handler);
  server.post('/authorize', handler);
};
