/**
 * Module dependencies
 */

var server = require('../../server');


/**
 * Export
 */

module.exports = function configuration (argv) {
  console.log(JSON.stringify(server.OpenIDConfiguration, null, 2));
  process.exit();
}
