/**
 * Module dependencies
 */

var util = require('util');


/**
 * InvalidRequestError
 */

function InvalidRequestError(description) {
  this.name = 'InvalidRequestError';
  this.message = 'invalid_request';
  this.description = description;
  this.statusCode = 400;
  Error.call(this, this.message);
  Error.captureStackTrace(this, arguments.callee);
}

util.inherits(InvalidRequestError, Error);


/**
 * Exports
 */

module.exports = InvalidRequestError;