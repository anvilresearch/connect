/**
 * Module dependencies
 */

var util = require('util')

/**
 * ValidationError
 */

function ValidationError (error) {
  this.name = 'ValidationError'
  this.error = 'validation_error'
  this.error_description = error.errors
  this.statusCode = 400
}

util.inherits(ValidationError, Error)

/**
 * Exports
 */

module.exports = ValidationError
