/**
 * Module dependencies
 */

var util = require('util');


/**
 * UnauthorizedError
 */

function UnauthorizedError(options, status) {
  this.name              = 'UnauthorizedError';
  this.error             = options.error || 'invalid_request';
  this.error_description = options.error_description;
  this.realm             = options.realm;
  this.scope             = options.scope;
  this.statusCode        = options.statusCode || 401;
  Error.call(this, this.message);
  Error.captureStackTrace(this, arguments.callee);
}

util.inherits(UnauthorizedError, Error);


/**
 * Error Codes
 */

UnauthorizedError.errorCodes = [
  'invalid_request',
  'invalid_token',
  'insufficient_scope'
];


/**
 * Exports
 */

module.exports = UnauthorizedError;

