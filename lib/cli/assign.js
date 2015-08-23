/**
 * Module dependencies
 */

var User = require('../../models/User')
var Client = require('../../models/Client')

/**
 * Export
 */

module.exports = function assign (argv) {
  var Model = (argv.c) ? Client : User
  var uuid = argv._[1]
  var role = argv._[2]

  function addRoles (uuid, role) {
    Model.addRoles(uuid, role, function (err, result) {
      if (err) {
        console.log(err.message || err.error)
        process.exit()
      }

      if (result[0][1] === 0) {
        console.log('%s already has the role "%s."', uuid, role)
      } else {
        console.log('%s now has the role "%s."', uuid, role)
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

      addRoles(user._id, role)
    })
  } else {
    addRoles(uuid, role)
  }
}
