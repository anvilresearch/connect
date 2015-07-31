/**
 * Module dependencies
 */

var JWT            = require('anvil-connect-jwt')
  , nowSeconds     = require('../lib/time-utils').nowSeconds


/**
 * Expires
 */

function expires (duration) {
  var fromNow = {
    day:   (60 * 60 * 24),
    week:  (60 * 60 * 24 * 7),
    month: (60 * 60 * 24 * 30)
  };

  return function () {
    return nowSeconds(fromNow[duration]);
  };
}


/**
 * ID Token
 */

var IDToken = JWT.define({

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
  claims: ['iss', 'sub', 'aud', 'exp', 'iat', 'nonce', 'acr', 'at_hash', 'amr'],

  // modify payload schema
  registeredClaims: {
    iss:      { format: 'StringOrURI', required: true },
    sub:      { format: 'StringOrURI', required: true },
    aud:      { format: 'StringOrURI', required: true },
    exp:      { format: 'IntDate',     required: true, default: expires('day')  },
    iat:      { format: 'IntDate',     required: true, default: nowSeconds },
    nonce:    { format: 'String' },
    acr:      { format: 'String' },
    at_hash:  { format: 'String' },
    amr:      { format: 'String*' }
  }

});


/**
 * Exports
 */

module.exports = IDToken;
