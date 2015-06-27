/**
 * Module dependencies
 */

var util = require('util');


/**
 * PasswordsDisabledError
 */

function PasswordsDisabledError() {
  this.name = 'PasswordsDisabledError';
  this.message = 'Password signin is disabled';
  this.statusCode = 400;
  Error.call(this, this.message);
  Error.captureStackTrace(this, arguments.callee);
}

util.inherits(PasswordsDisabledError, Error);


/**
 * Exports
 */

module.exports = PasswordsDisabledError;
