/**
 * Module dependencies
 */

var util = require('util')

/**
 * PasswordRequiredError
 */

function InsecurePasswordError () {
  this.name = 'InsecurePasswordError'
  this.message = 'Password must be complex.'
  this.statusCode = 400
}

util.inherits(InsecurePasswordError, Error)

/**
 * Exports
 */

module.exports = InsecurePasswordError
