/**
 * Module dependencies
 */

var User = require('../../models/User')
var Client = require('../../models/Client')

/**
 * Export
 */

module.exports = function revoke (argv) {
  var Model = (argv.c) ? Client : User
  var uuid = argv._[1]
  var role = argv._[2]

  function removeRoles (uuid, role) {
    Model.removeRoles(uuid, role, function (err, result) {
      if (err) {
        console.log(err.message || err.error)
        process.exit()
      }

      if (result[0] === 0) {
        console.log('%s does not have the role "%s."', uuid, role)
      } else {
        console.log('%s no longer has the role "%s."', uuid, role)
      }

      process.exit()
    })
  }

  if (uuid.indexOf('@') !== -1) {
    User.getByEmail(uuid, function (err, user) {
      if (err) {
        console.log(err.message || err.error)
        process.exit()
      }

      if (!user) {
        console.log('Unknown user.')
        process.exit()
      }

      removeRoles(user._id, role)
    })
  } else {
    removeRoles(uuid, role)
  }
}
