/**
 * Module dependencies
 */

var crypto = require('crypto')
  , settings = require('../boot/settings')
  , Client = require('../models/Client')
  , IDToken = require('../models/IDToken')
  , InvalidTokenError = require('../errors/InvalidTokenError')
  ;


/**
 * Signout
 */

function signout (req, res, next) {
  var uri      = req.query.post_logout_redirect_uri
    , hint     = req.query.id_token_hint
    ;

  // verify the uri using the hint
  if (uri && hint) {
    var token = IDToken.decode(hint, settings.publicKey);

    // the token checks out
    if (token && token instanceof Error === false) {
      Client.get(token.payload.aud, function (err, client) {

        // something smells bad
        if (err) {
          return next(err);
        }

        // unknown client
        else if (!client) {
          return next(new Error('Unknown client'));
        }

        // the uri is not registered.
        // logout, but don't redirect.
        else if (client.post_logout_redirect_uris.indexOf(uri) === -1) {
          req.logout();

          res.set({
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache'
          });

          res.sendStatus(204);
        }

        // logout and redirect
        else {
          req.logout();
          res.redirect(uri);
        }
      });
    }

    // can't decode the token
    else {
      return next(new InvalidTokenError("Can't decode id_token_hint"));
    }
  }

  // there's no way to verify the uri
  else if (uri) {
    req.logout();
    res.redirect(uri);
  }

  // logout and respond without redirect
  else {
    req.logout();

    res.set({
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    });

    res.sendStatus(204);
  }
}


/**
 * Export
 */

module.exports = signout;
