/**
 * Module dependencies
 */

var util = require('util')

/**
 * InvalidRequestError
 */

function InvalidRequestError (description) {
  this.name = 'InvalidRequestError'
  this.message = 'invalid_request'
  this.description = description
  this.statusCode = 400
}

util.inherits(InvalidRequestError, Error)

/**
 * Exports
 */

module.exports = InvalidRequestError
