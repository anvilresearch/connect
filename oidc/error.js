/**
 * Module dependencies
 */

var qs = require('qs')

/**
 * Error Response
 */

function error (err, req, res, next) {
  var message
  var errorName = err.error || err.message || err.name
  var errorDescription = err.error_description || err.description || err.message
  // 302 Redirect
  if (err.statusCode === 302 && err.redirect_uri) {
    var params = req.connectParams || req.query
    var responseMode = (params.response_mode && params.response_mode.trim()) ||
      (params.response_type === 'code' ||
        params.response_type === 'none') ? '?' : '#'
    var error = { error: errorName, error_description: errorDescription }
    var uri = err.redirect_uri + responseMode + qs.stringify(error)

    res.redirect(uri)

  // 400 Bad Request
  } else if (err.statusCode === 400) {
    res.set({
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    })

    res.status(400).json({
      error: errorName,
      error_description: errorDescription,
      error_uri: err.error_uri
    })

  // 401 Unauthorized
  } else if (err.statusCode === 401) {
    // rfc 6750 Bearer Token
    // http://tools.ietf.org/html/rfc6750#section-3
    res.set({
      'WWW-Authenticate': 'Bearer ' +
        'realm="' + err.realm + '", ' +
        'error="' + errorName + '", ' +
        'error_description="' + errorDescription + '"'
    })

    res.status(401).send('Unauthorized<br><br>' + errorDescription)

  // 403 Forbidden
  } else if (err.statusCode === 403) {
    message = 'Forbidden'

    if (req.app.get('env') === 'development') {
      message += '<br><br>' + errorDescription
    }

    res.status(403).send(message)

  // 500 Internal Server Error
  } else {
    var statusCode = err.statusCode || 500
    message = (err.statusCode && err.message) || 'Internal Server Error'

    if (req.app.get('env') === 'development') {
      message += '<br><br>' + errorDescription
    }

    res.status(statusCode).send(message)
  }
}

/**
 * Exports
 */

module.exports = error
