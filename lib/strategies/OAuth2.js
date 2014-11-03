/**
 * Module dependencies
 */

var request = require('superagent')
  , FormUrlencoded = require('form-urlencoded')
  ;

/**
 * Base64 Credentials
 *
 * Base64 encodes the user:password value for an HTTP Basic Authorization
 * header from a provider configuration object. The provider object should
 * specify a client_id and client_secret.
 */

function base64credentials (provider) {
  provider = provider || {};
  var credentials = provider.client_id + ':' + provider.client_secret;
  return new Buffer(credentials).toString('base64');
}


/**
 * Authorization Code Grant Request
 */

function authorizationCodeGrant (code, provider, config, done) {
  var url  = provider.endpoints.token.url
    , auth = provider.endpoints.token.auth
    ;

  var params = {};
  params.grant_type   = 'authorization_code';
  params.code         = code;
  params.redirect_uri = provider.redirect_uri;

  var req = request.post(url);
  req.send(FormUrlencoded.encode(params));

  if (auth === 'client_secret_basic') {
    req.set('Authorization', 'Basic ' + base64credentials(config));
  }

  req.set('user-agent', 'Anvil Connect/0.1.26')

  req.end(function (res) {
    done(null, res.body);
  });
}


/**
 * User Info
 */

function userInfo (token, provider, config, done) {
  var url  = provider.endpoints.user.url
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

/**
 * Exports
 */

module.exports = {
  base64credentials:      base64credentials,
  authorizationCodeGrant: authorizationCodeGrant,
  userInfo:               userInfo,
};
