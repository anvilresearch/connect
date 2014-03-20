/**
 * Module dependecies
 */

var base64url = require('base64url');


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
 * Encode
 */

JWT.encode = function (payload) {
  var header = this.header
    , algorithm = header.alg
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

  // TODO: validate the header
  // compute the encoded header value
  header = base64url(
    (typeof header !== 'String')
      ? JSON.stringify(header)
      : header
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

