/**
 * Module dependencies
 */

var server = require('../../server')
  , Role   = require('../../models/Role')
  ;


/**
 * Export
 */

module.exports = function assign (argv) {
  var role  = argv._[1]
    , scope = argv._[2]
    ;

  Role.removeScopes(role, scope, function (err, result) {
    if (err) {
      console.log(err.message || err.error);
      process.exit();
    }

    console.log(
      '%s is forbidden the scope "%s."', role, scope
    );

    process.exit();
  });
};
