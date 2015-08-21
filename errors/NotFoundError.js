/**
 * Module dependencies
 */

var util = require('util')

/**
 * NotFoundError
 */

function NotFoundError () {
  this.name = 'NotFoundError'
  this.message = 'Not found.'
  this.statusCode = 404
}

util.inherits(NotFoundError, Error)

/**
 * Exports
 */

module.exports = NotFoundError
