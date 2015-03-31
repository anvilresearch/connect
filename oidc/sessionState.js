/**
 * Module dependencies
 */

var bcrypt = require('bcrypt');


/**
 * Session State
 */

function sessionState (client, origin, state) {
  var salt  = bcrypt.genSaltSync(10);
  var value = [client._id, client.client_uri, state, salt].join(' ');
  var hash  = bcrypt.hashSync(value, salt);
  return [hash, salt].join(' ');
}


/**
 * Exports
 */

module.exports = sessionState;
