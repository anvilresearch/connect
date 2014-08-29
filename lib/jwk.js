/**
 * Module dependencies
 */

var jsrsasign = require('jsrsasign')
  , jsjws = require('jsjws')
  , KEYUTIL = jsrsasign.KEYUTIL
  , ASN1HEX = jsrsasign.ASN1HEX
  ;


/**
 * Exports
 */

module.exports = function toJWK(pem) {
  var lines   = pem.split("\n")
    , hex     = new Buffer(lines.slice(1, lines.length - 2).join(), 'base64').toString('hex')
    , a1      = ASN1HEX.getPosArrayOfChildren_AtObj(hex, 0)
    , idxPub  = ASN1HEX.getStartPosOfV_AtObj(hex, a1[1]) + 2
    , a2      = ASN1HEX.getPosArrayOfChildren_AtObj(hex, idxPub)
    , hN      = ASN1HEX.getHexOfV_AtObj(hex, a2[0])
    , hE      = ASN1HEX.getHexOfV_AtObj(hex, a2[1])
    ;

  return {
    kty: 'RSA',
    use: 'sig',
    alg: 'RS256',
    //kid: '..',
    n:    new Buffer(hN,  'hex').toString('base64'),
    e:    new Buffer(hE,  'hex').toString('base64'),
    //x5c: [new Buffer(hex, 'hex').toString('base64')]
  }
}

