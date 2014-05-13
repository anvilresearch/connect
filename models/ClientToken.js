/**
 * Module dependencies
 */

var JWT = require('../lib/JWT');


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
    //exp:   { format: 'IntDate',     required: true, default: expires('day')  },
    iat:   { format: 'IntDate',     required: true, default: Date.now },
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
