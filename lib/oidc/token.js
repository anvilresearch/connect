/**
 * Module dependencies
 */

var fs          = require('fs')
  , cwd         = process.cwd()
  , env         = process.env.NODE_ENV || 'development'
  , path        = require('path')
  , config      = require(path.join(cwd, 'config.' + env + '.json'))
  , AccessToken = require('../../models/AccessToken')
  , IDToken     = require('../../models/IDToken')
  ;


/**
 * Exchange code for token
 */
function token (server) {
  var privateKey = server.settings.privateKey
    , publicKey  = server.settings.publicKey
    ;

  return function (req, res, next) {
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
          iss: config.issuer,
          sub: ac.user_id,
          aud: ac.client_id,
          exp: Date.now() + (token.expires_in) * 1000,
        });
      }

      else {
        idToken = new IDToken({
          iss: config.issuer,
          sub: token.cid,
          aud: token.uid,
          exp: Date.now() + (token.expires_in) * 1000,
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

    else {
      // ????
    }

  }
}

/**
 * Exports
 */

module.exports = token;
