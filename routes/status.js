/**
 * Module dependencies
 */

var pkg = require('../package.json')
  , settings = require('../boot/settings')
  ;


/**
 * Status endpoint
 */

module.exports = function (server) {

  server.get('/', function (req, res, next) {
    res.json({
      "Anvil Connect": "Welcome",
      "issuer":         settings.issuer,
      "version":        pkg.version,
    })
  });

};
