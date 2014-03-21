/**
 * Module dependecies
 */

var _ = require('lodash')
  , util = require('util')
  , crypto = require('crypto')
  , base64url = require('base64url');


/**
 * Constructor
 */

function JWT () {}


/**
 * Supported algorithms
 */

JWT.algorithms = [
  'none'
];


/**
 * Registered headers
 */

JWT.registeredHeaders = {
  alg:  { format: 'StringOrURI', required: true, enum: JWT.algorithms },
  typ:  { format: 'String', default: 'JWT' },
  cty:  { format: 'String', enum: ['JWT'] },
  jku:  { format: 'URI' },
  jwk:  { format: 'JWK' },
  kid:  { format: 'String' },
  x5u:  { format: 'URI' },
  x5c:  { format: 'CertificateOrChain' },
  x5t:  { format: 'CertificateThumbprint' },
  crit: { format: 'ParameterList' },
};


/**
 * Registered claims
 */

JWT.registeredClaims = {
  iss: { format: 'StringOrURI' },
  sub: { format: 'StringOrURI' },
  aud: { format: 'StringOrURI*' },
  exp: { format: 'IntDate' },
  nbf: { format: 'IntDate' },
  iat: { format: 'IntDate' },
  jti: { format: 'CaseSensitiveString' },
};


/**
 * Define
 */

JWT.define = function (spec) {
  var header = spec.header
    , claims = spec.claims
    , NewJWT = new Function()
    ;

  util.inherits(NewJWT, JWT);
  _.extend(NewJWT, JWT);


  // TODO: validate the header
  NewJWT.header = header;
  NewJWT.headerJSON = JSON.stringify(header);
  NewJWT.headerB64u = base64url(JSON.stringify(header));
  NewJWT.algorithm = header.alg;

  return NewJWT;
};




/**
 * Encode
 */

JWT.encode = function (payload, secret) {
  var header = this.headerB64u
    , algorithm = this.algorithm
    , signingInput
    , signature
    ;


  // TODO: validate the payload
  // compute the encoded payload value
  payload = base64url(
    (typeof payload !== 'String')
      ? JSON.stringify(payload)
      : payload
  );


  // prepare the signing input
  signingInput = header + '.' + payload;

  // compute the signature
  switch (algorithm) {

    // plaintext
    case 'none':
      signature = '';
      break;

    // JWS
    case 'HS256':
      var hmac = crypto.createHmac('sha256', secret);
      hmac.update(new Buffer(signingInput));
      signature = base64url.fromBase64(hmac.digest('base64'));
      break;

    case 'RS256':
      var sign = crypto.createSign('RSA-SHA256');
      sign.update(new Buffer(signingInput));
      signature = base64url.fromBase64(sign.sign(secret, 'base64'));
      break;

    // JWE

    // Cannot encode
    default:
      throw new Error('Header must define "alg" parameter');

  }

  return signingInput + '.' + signature;
};


/**
 * Exports
 */

module.exports = JWT;

