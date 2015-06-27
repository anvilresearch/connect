/**
 * Module dependencies
 */

var ursa = require('ursa')


/**
 * Exports
 */

module.exports = function toJWK(pem) {
  var pub = ursa.coercePublicKey(pem)
  var n   = pub.getModulus('base64')
  var e   = pub.getExponent('base64')

  return {
    kty: 'RSA',
    use: 'sig',
    alg: 'RS256',
    n:    n,
    e:    e,
  }
}

