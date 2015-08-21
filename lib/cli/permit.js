/**
 * Module dependencies
 */

var Role = require('../../models/Role')

/**
 * Export
 */

module.exports = function assign (argv) {
  var role = argv._[1]
  var scope = argv._[2]

  Role.addScopes(role, scope, function (err, result) {
    if (err) {
      console.log(err.message || err.error)
      process.exit()
    }

    if (result[0] === 0) {
      console.log('%s is already permitted the scope "%s."', role, scope)
    } else {
      console.log('%s is now permitted the scope "%s."', role, scope)
    }

    process.exit()
  })
}
