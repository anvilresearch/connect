/**
 * Module dependencies
 */

var JWT            = require('anvil-connect-jwt')
  , nowSeconds     = require('../lib/time-utils').nowSeconds


/**
 * Client Access Token
 */

var ClientToken = JWT.define({

  // default header
  header: {
    alg: 'RS256'
  },

  // permitted headers
  headers: [
    'alg'
  ],

  // modify header schema
  registeredHeaders: {
    alg:   { format: 'StringOrURI', required: true, enum: ['RS256'] }
  },

  // permitted claims
  claims: ['iss', 'sub', 'aud', 'iat', 'scope'],

  // modify payload schema
  registeredClaims: {
    iss:   { format: 'StringOrURI', required: true },
    sub:   { format: 'StringOrURI', required: true },
    aud:   { format: 'StringOrURI', required: true },
    exp:   { format: 'IntDate' },
    iat:   { format: 'IntDate',     required: true, default: nowSeconds },
    scope: { format: 'String',      required: true, default: 'client' }
  }

});


/**
 * Issue
 */

ClientToken.issue = function (claims, privateKey, callback) {
  try {
    var token = new ClientToken(claims);
    var jwt = token.encode(privateKey);
    return callback(null, jwt);
  } catch (err) {
    callback(err)
    //callback(new Error('Unable to issue client access token'));
  }
};


/**
 * Exports
 */

module.exports = ClientToken;
