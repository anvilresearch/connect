/**
 * Module dependecies
 */

var _ = require('lodash')
  , jwa = require('jwa')
  , util = require('util')
  , base64url = require('base64url')
  ;


/**
 * Constructor
 */

function JWT () {}


/**
 * Supported algorithms
 */

JWT.algorithms = [
  'none',
  'HS256',
  'RS256',
  'ES256'
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
    , input
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
  input = header + '.' + payload;

  // compute the signature
  if (algorithm === 'none') {
    signature = '';
  } else {
    var signer = jwa(algorithm);
    signature = signer.sign(input, secret);
  }

  return input + '.' + signature;
};


/**
 * Exports
 */

module.exports = JWT;

