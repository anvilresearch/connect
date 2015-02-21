/**
 * Module dependencies
 */

var FormUrlencoded = require('form-urlencoded');


/**
 * Require signin
 */

function requireSignin (req, res, next) {
  if (!req.isAuthenticated() || req.connectParams.prompt === 'login') {
    res.redirect('/signin?' + FormUrlencoded.encode(req.connectParams));
  } else {
    next();
  }
}


/**
 * Exports
 */

module.exports = requireSignin;
