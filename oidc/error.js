/**
 * Module dependencies
 */

var FormUrlencoded = require('form-urlencoded');


/**
 * Error Response
 */

function error (err, req, res, next) {

  // 302 Redirect
  if (err.statusCode === 302 && err.redirect_uri) {
    var params = req.connectParams
      , responseMode = '?' || '#'
      , error = { error: err.error, error_description: err.error_description }
      , uri = err.redirect_uri + responseMode + FormUrlencoded.encode(error)
      ;

    res.redirect(uri);
  }


  // 400 Bad Request
  else if (err.statusCode === 400) {
    res.set({
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    });

    res.json(400, {
      error:              err.error || err.message,
      error_description:  err.error_description,
      error_uri:          err.error_uri
    });
  }


  // 401 Unauthorized
  else if (err.statusCode === 401) {

    // rfc 6750 Bearer Token
    // http://tools.ietf.org/html/rfc6750#section-3
    res.set({
      'WWW-Authenticate':
        'Bearer ' +
        'realm="'             + err.realm             + '", ' +
        'error="'             + err.error             + '", ' +
        'error_description="' + err.error_description + '"',
    });

    res.send(401, 'Unauthorized');
  }


  // 403 Forbidden
  else if (err.statusCode === 403) {
    res.send(403, 'Forbidden');
  }


  // 500 Internal Server Error
  else {
    var statusCode = err.statusCode || 500
      , message = (err.statusCode && err.message) || 'Internal Server Error'
      ;

    res.send(statusCode, message);
  }

}


/**
 * Exports
 */

module.exports = error;
