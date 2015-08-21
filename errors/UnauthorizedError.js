/**
 * Module dependencies
 */

var util = require('util')

/**
 * UnauthorizedError
 */

function UnauthorizedError (options, status) {
  this.name = 'UnauthorizedError'
  this.error = options.error
  this.error_description = options.error_description
  this.realm = options.realm
  this.scope = options.scope
  this.statusCode = options.statusCode || 401
}

util.inherits(UnauthorizedError, Error)

/**
 * Error Codes
 */

UnauthorizedError.errorCodes = [
  'invalid_request',
  'invalid_token',
  'insufficient_scope'
]

/**
 * Exports
 */

module.exports = UnauthorizedError
