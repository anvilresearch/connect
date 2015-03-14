/**
 * Module dependencies
 */

var settings    = require('../../boot/settings')
  , AccessToken = require('../../models/AccessTokenJWT')
  , ClientToken = require('../../models/ClientToken')


/**
 * Export
 */

module.exports = function decode (argv) {
  var JWT = (argv.c) ? ClientToken : AccessToken;
  console.log(JWT.decode(argv._[1], settings.publicKey));
  process.exit();
}
