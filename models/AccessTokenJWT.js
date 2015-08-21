/**
 * Module dependencies
 */

var JWT = require('anvil-connect-jwt')
var nowSeconds = require('../lib/time-utils').nowSeconds

/**
 * JWT AccessToken
 */

var AccessTokenJWT = JWT.define({
  // default header
  header: {
    alg: 'RS256'
  },

  headers: [
    'alg'
  ],

  // modify header schema
  registeredHeaders: {
    alg: { format: 'StringOrURI', required: true, enum: ['RS256'] }
  },

  // permitted claims
  claims: ['jti', 'iss', 'sub', 'aud', 'exp', 'iat', 'scope'],

  // modify payload schema
  registeredClaims: {
    jti: { format: 'String', required: true, from: 'at' },
    iss: { format: 'URI', required: true },
    iat: { format: 'IntDate', required: true, default: nowSeconds },
    exp: { format: 'IntDate', required: true, default: expires },
    sub: { format: 'String', required: true, from: 'uid' },
    aud: { format: 'String', required: true, from: 'cid' },
    scope: { format: 'String', required: true }
  }

})

/**
 * Expires
 */

function expires () {
  return nowSeconds(3600)
}

/**
 * Exports
 */

module.exports = AccessTokenJWT
