/**
 * Module dependencies
 */

var authenticator = require('../lib/authenticator')
var settings = require('../boot/settings')
var Client = require('../models/Client')
var IDToken = require('../models/IDToken')
var InvalidTokenError = require('../errors/InvalidTokenError')

/**
 * Signout
 */

function signout (req, res, next) {
  var uri = req.query.post_logout_redirect_uri
  var hint = req.query.id_token_hint
  var token = uri && hint && IDToken.decode(hint, settings.keys.sig.pub)

  // verify the uri using the hint
  if (token && token instanceof Error === false) {
    Client.get(token.payload.aud, function (err, client) {
      var uris = client && client.post_logout_redirect_uris

      // something smells bad
      if (err) {
        return next(err)

      // unknown client, or the uri is not registered.
      // logout, but don't redirect.
      } else if (!uris || uris.indexOf(uri) === -1) {
        authenticator.logout(req)

        res.set({
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache'
        })

        res.sendStatus(204)

      // logout and redirect
      } else {
        authenticator.logout(req)
        res.redirect(uri)
      }
    })

  // logout and respond without redirect
  } else {
    authenticator.logout(req)

    res.set({
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    })

    res.sendStatus(204)
  }
}

/**
 * Export
 */

module.exports = signout
