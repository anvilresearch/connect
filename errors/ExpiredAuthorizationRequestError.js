/**
 * Module dependencies
 */

var util = require('util')

/**
 * ExpiredAuthorizationRequestError
 */

function ExpiredAuthorizationRequestError () {
  this.name = 'ExpiredAuthorizationRequestError'
  this.message = 'Expired authorization code.'
  this.statusCode = 400
}

util.inherits(ExpiredAuthorizationRequestError, Error)

/**
 * Exports
 */

module.exports = ExpiredAuthorizationRequestError
