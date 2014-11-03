/**
 * Module dependencies
 */

var URL = require('url')
  , util = require('util')
  , Strategy = require('passport-strategy')
  , request = require('superagent')
  , FormUrlencoded = require('form-urlencoded')
  ;


/**
 * OAuth2Strategy
 */

function OAuth2Strategy (provider, client, verify) {
  Strategy.call(this);
  this.provider = provider;
  this.endpoints = provider.endpoints;
  this.client = client;
  this.name = provider.id;
}

util.inherits(OAuth2Strategy, Strategy);


/**
 * Base64 Credentials
 *
 * Base64 encodes the user:password value for an HTTP Basic Authorization
 * header from a provider configuration object. The provider object should
 * specify a client_id and client_secret.
 */

function base64credentials () {
  var id          = this.client.client_id
    , secret      = this.client.client_secret
    , credentials = id + ':' + secret
    ;

  return new Buffer(credentials).toString('base64');
}

OAuth2Strategy.prototype.base64credentials = base64credentials;


/**
 * Authorization Request
 */

function authorizationRequest (options) {
  var provider      = this.provider
    , endpoints     = this.endpoints
    , config        = this.client
    , url           = URL.parse(endpoints.authorize.url)
    , response_type = 'code'
    , client_id     = config.client_id
    , redirect_uri  = provider.redirect_uri
    ;

  url.query = {
    response_type:  response_type,
    client_id:      client_id,
    redirect_uri:   redirect_uri,
  };

  if (provider.scope || config.scope) {
    var s1 = provider.scope || []
      , s2 = config.scope   || []
      , sp = provider.separator
      ;

    url.query.scope = s1.concat(s2).join(sp);
  }

  this.redirect(URL.format(url))
}

OAuth2Strategy.prototype.authorizationRequest = authorizationRequest;


/**
 * Authorization Code Grant Request
 */

function authorizationCodeGrant (code, done) {
  var url  = this.endpoints.token.url
    , auth = this.endpoints.token.auth
    ;

  var params = {};
  params.grant_type   = 'authorization_code';
  params.code         = code;
  params.redirect_uri = this.provider.redirect_uri;

  var req = request.post(url);
  req.send(FormUrlencoded.encode(params));

  if (auth === 'client_secret_basic') {
    req.set('Authorization', 'Basic ' + this.base64credentials());
  }

  req.set('user-agent', 'Anvil Connect/0.1.26')

  req.end(function (res) {
    done(null, res.body);
  });
}

OAuth2Strategy.prototype.authorizationCodeGrant = authorizationCodeGrant;


/**
 * User Info
 */

function userInfo (token, done) {
  var provider = this.provider
    , url  = provider.endpoints.user.url
    , auth = provider.endpoints.user.auth
    ;

  var req = request.get(provider.endpoints.user.url);

  if (auth === 'bearer_token') {
    req.set('Authorization', 'Bearer ' + token);
  }

  req.set('user-agent', 'Anvil Connect/0.1.26')

  req.end(function (res) {
    done(null, res.body);
  });
}

OAuth2Strategy.prototype.userInfo = userInfo;


/**
 * Exports
 */

module.exports = OAuth2Strategy;
