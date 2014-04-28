/**
 * Module dependencies
 */

var FormUrlencoded = require('form-urlencoded');


/**
 * Error Response
 */

function error (err, req, res, next) {

  //console.log(err)

  if (err.statusCode === 302 && err.redirect_uri) {
    var params = req.connectParams
      , responseMode = '?' || '#'
      , error = { error: err.error, error_description: err.error_description }
      , uri = err.redirect_uri + responseMode + FormUrlencoded.encode(error)
      ;

    res.redirect(uri);
  }

  else if (err.statusCode === 400) {
    res.json(400, {
      error:              err.error || err.message,
      error_description:  err.error_description,
      error_uri:          err.error_uri
    });
  }

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

  else if (err.statusCode === 403) {
    res.send(403, 'Forbidden');
  }

  else {
    res.send(err.statusCode || 500, err.message);
  }

}


/**
 * Exports
 */

module.exports = error;
