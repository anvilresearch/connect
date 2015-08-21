/**
 * Module dependencies
 */

var util = require('util')

/**
 * PasswordRequiredError
 */

function PasswordRequiredError () {
  this.name = 'PasswordRequiredError'
  this.message = 'A password is required'
  this.statusCode = 400
}

util.inherits(PasswordRequiredError, Error)

/**
 * Exports
 */

module.exports = PasswordRequiredError
