/**
 * Module dependencies
 */

var util = require('util');


/**
 * AuthorizationError
 */

function AuthorizationError(options, status) {
  this.name              = 'AuthorizationError';
  this.error             = options.error || 'invalid_request';
  this.error_description = options.error_description;
  this.redirect_uri      = options.redirect_uri;
  this.statusCode        = options.statusCode || 400;
  Error.call(this, this.message);
  Error.captureStackTrace(this, arguments.callee);
}

util.inherits(AuthorizationError, Error);





/**
 * Exports
 */

module.exports = AuthorizationError;
