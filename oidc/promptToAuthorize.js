/**
 * Module dependencies
 */

var qs = require('qs')

/**
 * Prompt to authorize
 */

function promptToAuthorize (req, res, next) {
  var params = req.connectParams
  var client = req.client
  var user = req.user
  var scopes = req.scopes

  // The client is not trusted and the user has yet to decide on consent
  if (client.trusted !== 'true' && typeof params.authorize === 'undefined') {
    // render the consent view
    if (req.path === '/authorize') {
      res.render('authorize', {
        request: params,
        client: client,
        user: user,
        scopes: scopes
      })

    // redirect to the authorize endpoint
    } else {
      res.redirect('/authorize?' + qs.stringify(params))
    }

  // The client is trusted and consent is implied.
  } else if (client.trusted === 'true') {
    params.authorize = 'true'
    next()

  // The client is not trusted and consent is decided
  } else {
    next()
  }

}

/**
 * Exports
 */

module.exports = promptToAuthorize
