/**
 * Module dependencies
 */

var request   = require('superagent')
  , providers = require('../providers')
  , User      = require('../models/User')
  , InvalidRequestError = require('../errors/InvalidRequestError')
  ;


/**
 * Revoke
 */

function revoke (req, res, next) {
  var provider = providers[req.params.provider]
    , endpoint = provider && provider.endpoints && provider.endpoints.revoke
    ;

  if (!provider) {
    return next(new InvalidRequestError('Unknown provider'));
  }

  if (!endpoint) {
    return next(new InvalidRequestError('Undefined revoke endpoint'));
  }

  User.get(req.claims.sub, function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(new InvalidRequestError('Unknown user'));
    }

    if (!user.providers[req.params.provider]) {
      return next(new InvalidRequestError('No provider for this user'));
    }

    var auth   = user.providers[req.params.provider].auth
      , url    = endpoint.url
      , method = endpoint.method.toLowerCase()
      , param  = endpoint.auth && endpoint.auth.param
      , token  = auth && auth.access_token
      ;

    request[method](url)
      .query(param + '=' + token)
      .end(function (err, response) {
        res.json({
          err: err,
          response: response
        });
      });
  });
}


/**
 * Exports
 */

module.exports = revoke;
