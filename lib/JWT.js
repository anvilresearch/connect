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
  var header = base64url(JSON.stringify(JWT.header || '{}'))
    , payload = base64url(
        (typeof payload === 'String')
          ? payload
          : JSON.stringify(payload)
      );

  return header  + '.'
       + payload + '.'
       + ''
       ;
};


/**
 * Exports
 */

module.exports = JWT;

