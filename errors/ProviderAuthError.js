/**
 * Module dependencies
 */

var util = require('util');


/**
 * ProviderAuthError
 *
 * This error is used by Passport in the event of an authorization
 * error with a third party provider.
 */

function ProviderAuthError(options, status) {
  if (!status) {
    switch (options.error) {
      case 'access_denied':           status = 403; break;
      case 'server_error':            status = 502; break;
      case 'temporarily_unavailable': status = 503; break;
    }
  }

  Error.call(this, this.message);
  Error.captureStackTrace(this, arguments.callee);

  this.name = 'ProviderAuthError';
  this.code = options.error || 'server_error';
  this.message = options.error_description;
  this.status = status || 500;
}

util.inherits(ProviderAuthError, Error);





/**
 * Exports
 */

module.exports = ProviderAuthError;
