/**
 * Module dependencies
 */

var server      = require('../../server')
  , AccessToken = require('../../models/AccessToken').AccessJWT
  , ClientToken = require('../../models/ClientToken')


/**
 * Export
 */

module.exports = function decode (argv) {
  var JWT = (argv.c) ? ClientToken : AccessToken;
  console.log(JWT.decode(argv._[1], server.settings.publicKey));
  process.exit();
}
