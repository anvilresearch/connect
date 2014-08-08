
/**
 * Module dependencies
 */

var util = require('util');


/**
 * MissingStateError
 */

function MissingStateError() {
  this.name = 'MissingStateError';
  this.message = 'Missing state param.';
  this.statusCode = 400;
  Error.call(this, this.message);
  Error.captureStackTrace(this, arguments.callee);
}

util.inherits(MissingStateError, Error);


/**
 * Exports
 */

module.exports = MissingStateError;
