/**
 * Module dependencies
 */

var util = require('util');


/**
 * ExpiredAuthorizationRequestError
 */

function ExpiredAuthorizationRequestError() {
  this.name = 'ExpiredAuthorizationRequestError';
  this.message = 'Expired authorization code.';
  this.statusCode = 400;
  Error.call(this, this.message);
  Error.captureStackTrace(this, arguments.callee);
}

util.inherits(ExpiredAuthorizationRequestError, Error);


/**
 * Exports
 */

module.exports = ExpiredAuthorizationRequestError;
