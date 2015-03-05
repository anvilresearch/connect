/**
 * Module dependencies
 */

var settings    = require('../boot/settings')
  , AccessToken = require('../models/AccessToken')
  , ClientToken = require('../models/ClientToken')
  , IDToken     = require('../models/IDToken')
  , nowSeconds  = require('../lib/time-utils').nowSeconds
  ;


/**
 * Exchange code for token
 */

module.exports = function (server) {
  var privateKey = server.settings.privateKey
    , publicKey  = server.settings.publicKey
    ;

  return function token (req, res, next) {
    var params = req.body
      , ac     = req.code
      ;

    function tokenResponse (err, token) {
      if (err) {
        return next(err);
      }

      var idToken
        , response = token.project('issue')
        ;

      if (req.client.access_token_type !== 'random') {
        response.access_token = token.toJWT(server.settings.privateKey);
      }

      if (ac) {
        idToken = new IDToken({
          iss: settings.issuer,
          sub: ac.user_id,
          aud: ac.client_id,
          exp: nowSeconds(token.ei)
        });
      }

      else {
        idToken = new IDToken({
          iss: settings.issuer,
          sub: token.cid,
          aud: token.uid,
          exp: nowSeconds(token.ei)
        });
      }

      response.id_token = idToken.encode(privateKey);

      if (params.state) {
        response.state = params.state;
      }

      res.set({
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache'
      });

      res.json(response);
    }

    // AUTHORIZATION CODE GRANT
    if (params.grant_type === 'authorization_code') {
      AccessToken.exchange(req, server, tokenResponse);
    }

    // REFRESH GRANT
    else if (params.grant_type === 'refresh_token') {
      var refreshToken = params.refresh_token
        , clientId = req.client._id
        ;

      AccessToken.refresh(refreshToken, clientId, server, tokenResponse);
    }

    // CLIENT CREDENTIALS GRANT (OAuth 2.0)
    else if (params.grant_type === 'client_credentials') {
      ClientToken.issue({
        iss:   settings.issuer,
        sub:   req.client._id,
        aud:   req.client._id,
        exp:   req.client.default_max_age,
        scope: req.scope,
      }, privateKey, function (err, token) {
        if (err) { return next(err); }

        res.set({
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache'
        });

        var response = {
          access_token: token,
          token_type:   'Bearer'
        };

        if (req.client.default_max_age) {
          response.expires_in = req.client.default_max_age;
        }

        res.json(response);
      });
    }

    else {
      // ????
    }
  };
};

