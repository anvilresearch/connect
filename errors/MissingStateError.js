/**
 * Module dependencies
 */

var util = require('util')

/**
 * MissingStateError
 */

function MissingStateError () {
  this.name = 'MissingStateError'
  this.message = 'Missing state param.'
  this.statusCode = 400
}

util.inherits(MissingStateError, Error)

/**
 * Exports
 */

module.exports = MissingStateError
