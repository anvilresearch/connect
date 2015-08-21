/**
 * Module dependencies
 */

var util = require('util')

/**
 * PasswordsDisabledError
 */

function PasswordsDisabledError () {
  this.name = 'PasswordsDisabledError'
  this.message = 'Password signin is disabled'
  this.statusCode = 400
}

util.inherits(PasswordsDisabledError, Error)

/**
 * Exports
 */

module.exports = PasswordsDisabledError
