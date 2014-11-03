/**
 * Module dependencies
 */


/**
 * Base64 Credentials
 *
 * Base64 encodes the user:password value for an HTTP Basic Authorization
 * header from a provider configuration object. The provider object should
 * specify a client_id and client_secret.
 */

function base64credentials (provider) {
  provider = provider || {};
  var credentials = provider.client_id + ':' + provider.client_secret;
  return new Buffer(credentials).toString('base64');
}


/**
 * Exports
 */

module.exports = {
  base64credentials: base64credentials
};
