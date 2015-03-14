/**
 * Module dependencies
 */

var qs = require('qs');


/**
 * Require signin
 */

function requireSignin (req, res, next) {
  if (!req.isAuthenticated() || req.connectParams.prompt === 'login') {
    res.redirect('/signin?' + qs.stringify(req.connectParams));
  } else {
    next();
  }
}


/**
 * Exports
 */

module.exports = requireSignin;
