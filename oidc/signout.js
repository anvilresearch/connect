/**
 * Module dependencies
 */
var authenticator = require('../lib/authenticator')
var settings = require('../boot/settings')
var Client = require('../models/Client')
var IDToken = require('../models/IDToken')

/**
 * Handles signout requests (GETs or POSTs to the /signout endpoint) and ends a
 * user's session. If an ID Token hint and a post-signout URI are provided,
 * verifies that the URI has been pre-registered, signs out, and redirects the
 * user to it. Otherwise, just signs out with no redirect.
 * @method signout
 * @param [req.query.id_token_hint] {String}
 * @param [req.body.id_token_hint] {String} Id Token hint, identifies the
 *   client/user
 * @param [req.query.post_logout_redirect_uri] {String}
 * @param [req.body.post_logout_redirect_uri] {String} If specified, this
 *   handler verifies that the uri was pre-registered, and sends a redirect to
 *   it via an HTTP 303 See Other response.
 * @param [req.query.state] {String}
 * @param [req.body.state] {String} Opaque OIDC state parameter
 */
function signout (req, res, next) {
  var idToken, clientId
  var params = req.query || req.body
  var postLogoutUri = params.post_logout_redirect_uri
  var idHint = params.id_token_hint
  var state = params.state

  if (idHint) {
    idToken = IDToken.decode(idHint, settings.keys.sig.pub)
    if (idToken instanceof Error) { return next(idToken) }
    clientId = idToken.payload.aud
  }
  if (idToken && postLogoutUri) {
    // Verify the post-signout uri (must have been registered for this client)
    Client.get(clientId, function (err, client) {
      if (err) { return next(err) }
      var isValidUri = false
      if (client) {
        var registeredUris = client.post_logout_redirect_uris
        isValidUri = registeredUris &&
          (registeredUris.indexOf(postLogoutUri) !== -1)
      }
      if (isValidUri) {
        if (state) {
          postLogoutUri += '?state=' + state
        }
        // sign out and redirect
        authenticator.logout(req)
        res.redirect(303, postLogoutUri)
        return
      }
      // Otherwise, fall through to default case below
    })
  }
  // Handle all the other cases - no postLogoutUri specified, or the client is
  // unknown, or the given postLogoutUri has not been registered previously.
  // Do not redirect, simply sign out
  authenticator.logout(req)
  res.set({
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache'
  })
  res.sendStatus(204)
}

/**
 * Export
 */
module.exports = signout
