/**
 * Module dependencies
 */

var server = require('../../server')
  , User   = require('../../models/User')
  ;


/**
 * Export
 */

module.exports = function assign (argv) {
  var email = argv._[1]
    , role  = argv._[2]
    ;

  User.getByEmail(email, function (err, user) {
    if (!user) {
      console.log('Unknown user.');
      process.exit();
    }

    User.addRoles(user, role, function (err, result) {
      if (err) {
        console.log(err.message || err.error);
        process.exit();
      }

      if (result[0] === 0) {
        console.log('%s (%s) already has the role "%s."', user.name, user.email, role);
      } else {
        console.log('%s (%s) now has the role "%s."', user.name, user.email, role);
      }

      process.exit();
    });
  });
}
