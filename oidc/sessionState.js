/**
 * Module dependencies
 */

var crypto = require('crypto');


/**
 * Session State
 */

function sessionState (client, origin, state) {
  var salt = crypto.randomBytes(16).toString('hex');
  var value = [client._id, client.client_uri, state, salt].join(' ');
  var sha256 = crypto.createHash('sha256');
  sha256.update(value);
  var hash = sha256.digest('hex');
  return [hash, salt].join('.')
}


/**
 * Exports
 */

module.exports = sessionState;
