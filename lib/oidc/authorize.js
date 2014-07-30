/**
 * Module dependencies
 */

var crypto            = require('crypto')
  , IDToken           = require('../../models/IDToken')
  , AccessToken       = require('../../models/AccessToken')
  , AuthorizationCode = require('../../models/AuthorizationCode')
  , FormUrlencoded    = require('form-urlencoded')
  ;


/**
 * Authorize
 *
 * By the time we get here, we can assume the params
 * are valid, the client is authenticated, and the user
 * is authenticated.
 *
 * This function should issue an authorization code or
 * a set of security tokens, depending on the params.
 */

function authorizeFactory (server) {

  return function authorize (req, res, next) {
    var params = req.connectParams;

    // ACCESS GRANTED
    if (params.authorize === "true") {

      // Authorization Code Grant
      if (params.response_type === 'code') {
        AuthorizationCode.insert({

          client_id:    req.client._id,
          redirect_uri: params.redirect_uri,
          max_age:      parseInt(params.max_age) || req.client.default_max_age,
          user_id:      req.user._id,
          scope:        req.scope

        }, function (err, ac) {
          if (err) { return next(err); }

          // Ugly to do this explicitly, but FormUrlencoded will add an
          // empty state param if we pass an undefined state.
          var response = {
            code: ac.code
          };

          if (params.state) {
            response.state = params.state;
          }

          res.redirect(params.redirect_uri + '?' + FormUrlencoded.encode(response));
        });
      }

      // Implicit Grant
      if (params.response_type === 'id_token token') {
        AccessToken.issue(req, server, function (err, response) {
          if (err) { return next(err); }

          var shasum, hash;
          shasum = crypto.createHash('sha256');
          shasum.update(response.access_token);
          hash   = shasum.digest('hex');
          atHash = hash.slice(0, hash.length / 2);

          var idToken = new IDToken({
            iss:      server.settings.issuer,
            sub:      req.user._id,
            aud:      req.client._id,
            exp:      Date.now() + (response.expires_in) * 1000,
            nonce:    params.nonce,
            at_hash:  atHash
          });

          response.id_token = idToken.encode(server.settings.privateKey);

          if (params.state) {
            response.state = params.state
          }

          res.redirect(params.redirect_uri + '#' + FormUrlencoded.encode(response));
        });
      }

    }

    // ACCESS DENIED
    else {
      res.redirect(params.redirect_uri + '?error=access_denied');
    }
  }

}

/**
 * Exports
 */

module.exports = authorizeFactory;
