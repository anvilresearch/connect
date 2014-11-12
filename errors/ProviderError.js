/**
 * Module dependencies
 */

var util = require('util');


/**
 * ProviderError
 */

function ProviderError(message) {
  this.name = 'ProviderError';
  this.message = message;
  Error.call(this, this.message);
  Error.captureStackTrace(this, arguments.callee);
}

util.inherits(ProviderError, Error);


/**
 * Exports
 */

module.exports = ProviderError;
