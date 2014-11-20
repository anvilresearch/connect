/**
 * Module dependencies
 */

var URL      = require('url')
  , util     = require('util')
  , crypto   = require('crypto')
  , request  = require('superagent')
  , Strategy = require('passport-strategy')
  ;


/**
 * OAuthStrategy
 */

function OAuthStrategy (provider, client, verify) {
  Strategy.call(this);
  this.provider   = provider;
  this.endpoints  = provider.endpoints;
  this.client     = client;
  this.verify     = verify;
  this.name       = provider.id;
}

util.inherits(OAuthStrategy, Strategy);


/**
 * Authorization Header Params
 * https://tools.ietf.org/html/rfc5849#section-3.5.1
 */

function authorizationHeaderParams (data) {
  var keys    = Object.keys(data)
    , encoded = ''
    ;

  keys.forEach(function (key, i) {
    encoded += key;
    encoded += '="';
    encoded += encodeOAuthData(data[key]);
    encoded += '"';
    if (i < keys.length - 1) {
      encoded += ', ';
    }
  });

  return encoded;
}

OAuthStrategy.authorizationHeaderParams = authorizationHeaderParams;


/**
 * Encode Data
 * https://tools.ietf.org/html/rfc5849#section-3.6
 */

function encodeOAuthData (data) {
  // empty data
  if (!data || data === '') {
    return '';
  }

  // non-empty data
  else {
    return encodeURIComponent(data)
      .replace(/\!/g, "%21")
      .replace(/\'/g, "%27")
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29")
      .replace(/\*/g, "%2A")
      ;
  }
}

OAuthStrategy.encodeOAuthData = encodeOAuthData;


/**
 * Timestamp
 */

function timestamp () {
  return Math.floor(
    (new Date())
      .getTime() / 1000
  );
}

OAuthStrategy.timestamp = timestamp;


/**
 * Nonce
 */

function nonce (size) {
  return crypto.randomBytes(size).toString('hex').slice(0, 10);
}

OAuthStrategy.nonce = nonce;


/**
 * Signature Base String URI
 * https://tools.ietf.org/html/rfc5849#section-3.4.1.1
 * https://tools.ietf.org/html/rfc5849#section-3.4.1.2
 */

function signatureBaseStringURI (uri) {
  var url      = URL.parse(uri, true)
    , protocol = url.protocol
    , hostname = url.hostname
    , pathname = url.pathname
    , port     = ''
    ;

  if (url.port) {
    if ((protocol === 'http:'  && url.port !== '80')
     || (protocol === 'https:' && url.port !== '443')) {
      port = ':' + url.port;
    }
  }

  if (!pathname || pathname === '') {
    pathname = '/';
  }

  return protocol + '//' + hostname + port + pathname;
}

OAuthStrategy.signatureBaseStringURI = signatureBaseStringURI;


/**
 * Normalize Parameters
 * https://tools.ietf.org/html/rfc5849#section-3.4.1.3.2
 */

// THIS NEEDS SOME LOVE TO BE TRUE TO SPEC
function normalizeParameters (data) {
  var encoded    = {}
    , normalized = ''
    ;

  Object.keys(data).forEach(function (key) {
    encoded[encodeOAuthData(key)] = encodeOAuthData(data[key]);
  });

  var ordering = Object.keys(encoded).sort();

  ordering.forEach(function (key, i) {
    normalized += key;
    normalized += '=';
    normalized += encoded[key];
    if (i < ordering.length - 1) {
      normalized += '&';
    }
  });

  return normalized;
}

OAuthStrategy.normalizeParameters = normalizeParameters;


/**
 * Signature Base String
 * https://tools.ietf.org/html/rfc5849#section-3.4.1
 */

function signatureBaseString (method, url, parameters) {
  return method.toUpperCase() + '&'
       + encodeOAuthData(signatureBaseStringURI(url)) + '&'
       + encodeOAuthData(parameters)
       ;
}

OAuthStrategy.signatureBaseString = signatureBaseString;


/**
 * Signature
 */

function sign (method, input, key) {
  var encoding = 'base64'
    , result   = ''
    ;

  switch (method) {

    case 'PLAINTEXT':
      result = key;
      break;

    case 'RSA-SHA1':
      result = crypto.createSign(method).update(input).sign(key, encoding);
      break;

    case 'HMAC-SHA1':
      result = crypto.createHmac('sha1', key).update(input).digest(encoding);
      break;

    default:
      // ERROR

  }

  return result;
}

OAuthStrategy.sign = sign;


/**
 * Exports
 */

module.exports = OAuthStrategy;
