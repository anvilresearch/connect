/**
 * Module dependencies
 */

var JWT = require('../lib/JWT');


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

  // modify payload schema
  registeredClaims: {
    iss:   { format: 'StringOrURI', required: true },
    sub:   { format: 'StringOrURI', required: true },
    exp:   { format: 'IntDate', required: true },
    iat:   { format: 'IntDate', required: true },
    nonce: { format: 'String' },
    acr:   { format: 'String' }
  }

});


/**
 * Exports
 */

module.exports = IDToken;
