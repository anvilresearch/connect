/**
 * Module dependencies
 */

var util = require('util')

/**
 * InsufficientScopeError
 */

function InsufficientScopeError () {
  this.name = 'InsufficientScopeError'
  this.message = 'insufficient_scope'
  this.description = 'Insufficient scope'
  this.statusCode = 400
}

util.inherits(InsufficientScopeError, Error)

/**
 * Exports
 */

module.exports = InsufficientScopeError
