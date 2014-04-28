/**
 * Module dependencies
 */

var oidc = require('../lib/oidc');


/**
 * Exports
 */

module.exports = function (server) {

  server.use(oidc.error);

};
