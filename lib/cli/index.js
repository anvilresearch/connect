/**
 * Module dependencies
 */

var cli = module.exports
  , path = require('path')
  ;


/**
 * TODO:
 * - initialize deployment

 *   - print remaining steps
 * - regenerate key pairs
 * - generate default roles/scopes/associations/clients
 * - generate first user sign in link
 * - assign roles
 */

cli.run = function (argv) {
  var cmd = argv._.shift()

  if (cmd === 'init' && argv._.length > 0) {
    cmd += '-' + argv._.shift();
  }

  require(path.join(__dirname, './' + cmd))(argv);
}

