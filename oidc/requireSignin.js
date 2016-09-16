/**
 * Module dependencies
 */

var qs = require('qs')
var sessionState = require('./sessionState')

/**
 * Require signin
 */

function requireSignin (req, res, next) {
  var params = req.connectParams
  var prompt = params.prompt
  var responseMode = (params.response_mode && params.response_mode.trim()) ||
    (params.response_type.trim() === 'code' ||
      params.response_type.trim() === 'none') ? '?' : '#'

  // redirect with error if unauthenticated
  // and prompt is "none"
  if (!req.user && prompt === 'none') {
    res.redirect(req.connectParams.redirect_uri + responseMode + qs.stringify({
      error: 'login_required',
      state: req.connectParams.state,
      session_state: sessionState(req.client, req.client.client_uri, req.session.opbs)
    }))

  // prompt to sign in
  } else if (!req.user || prompt === 'login') {
    res.redirect('/signin?' + qs.stringify(req.connectParams))

  // do not prompt to sign in
  } else {
    next()
  }
}

/**
 * Exports
 */

module.exports = requireSignin
