/**
 * Module dependencies
 */

var crypto            = require('crypto')
  , async             = require('async')
  , settings          = require('../boot/settings')
  , IDToken           = require('../models/IDToken')
  , AccessToken       = require('../models/AccessToken')
  , AuthorizationCode = require('../models/AuthorizationCode')
  , FormUrlencoded    = require('form-urlencoded')
  , nowSeconds        = require('../lib/time-utils').nowSeconds
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

module.exports = function (server) {

  return function authorize (req, res, next) {
    var params        = req.connectParams
      , responseTypes = params.response_type.split(' ')
      , responseMode  = params.response_mode
                     || (responseTypes.indexOf('code') !== -1)
                          ? '?'
                          : '#'
                          ;

    // ACCESS GRANTED
    if (params.authorize === "true") {

      // compose the response
      async.waterfall([

        function includeAccessToken (callback) {
          if (responseTypes.indexOf('token') !== -1) {
            AccessToken.issue(req, function (err, response) {
              if (err) { return callback(err); }
              callback(null, response);
            });
          }

          // initialize an empty response
          else {
            callback(null, {});
          }
        },

        function includeAuthorizationCode (response, callback) {
          if (responseTypes.indexOf('code') !== -1) {
            AuthorizationCode.insert({

              client_id:    req.client._id,
              redirect_uri: params.redirect_uri,
              max_age:      parseInt(params.max_age) || req.client.default_max_age,
              user_id:      req.user._id,
              scope:        req.scope

            }, function (err, ac) {
              if (err) { return callback(err); }
              response.code = ac.code;
              callback(null, response);
            });
          }

          // pass through to next
          else {
            callback(null, response);
          }
        },

        function includeIDToken (response, callback) {
          if (responseTypes.indexOf('id_token') !== -1) {
            var shasum, hash, atHash;

            if (response.access_token) {
              shasum = crypto.createHash('sha256');
              shasum.update(response.access_token);
              hash   = shasum.digest('hex');
              atHash = hash.slice(0, hash.length / 2);
            }

            var idToken = new IDToken({
              iss:      settings.issuer,
              sub:      req.user._id,
              aud:      req.client._id,
              exp:      nowSeconds(response.expires_in),
              nonce:    params.nonce,
              at_hash:  atHash
            });

            response.id_token = idToken.encode(settings.privateKey);
          }

          callback(null, response);

        }

      ], function (err, response) {
          if (err) { return next(err); }

          if (params.state) {
            response.state = params.state;
          }

          res.redirect(
            params.redirect_uri + responseMode + FormUrlencoded.encode(response)
          );
      });
    }

    // ACCESS DENIED
    else {
      res.redirect(params.redirect_uri + '?error=access_denied');
    }
  };
};

