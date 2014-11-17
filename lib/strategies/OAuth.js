/**
 * Module dependencies
 */

var util     = require('util')
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
 * OAuth Params
 */

function authorizationHeader (req, header, scheme, params) {
  var keys    = Object.keys(params)
    , encoded = scheme + ' '
    ;

  keys.forEach(function (key, i) {
    encoded += key;
    encoded += '="';
    encoded += encodeURIComponent(params[key]);
    encoded += '"';
    if (i < keys.length - 1) {
      encoded += ', ';
    }
  });

  req.set(header, encoded);
}

OAuthStrategy.prototype.authorizationHeader = authorizationHeader;


/**
 * Request Temporary Credentials
 */

function requestTemporaryCredentials (done) {
  var strategy = this
    , provider = strategy.provider
    , client   = strategy.client
    , endpoint = strategy.endpoints.credentials
    , method   = endpoint.method && endpoint.method.toLowerCase()
    , url      = endpoint.url
    , auth     = endpoint.auth
    , header   = auth.header || 'Authorization'
    , scheme   = auth.scheme || 'OAuth'
    , params   = {}
    ;

  // Initialize the request
  var req = request[method || 'post'](url);

  // Authorization Params
  params.oauth_consumer_key = client.oauth_consumer_key;
  params.oauth_signature_method = client.oauth_signature_method;
  params.oauth_callback = client.oauth_callback;

  // Authorization header
  strategy.authorizationHeader(req, header, scheme, params)

  // Execute the request
  return req.end(function (res) {
    done()
  });
}

OAuthStrategy.prototype.requestTemporaryCredentials = requestTemporaryCredentials;


/**
 * Authenticate
 */

function authenticate (req, options) {

}

OAuthStrategy.prototype.authenticate = authenticate;


/**
 * Exports
 */

module.exports = OAuthStrategy;
