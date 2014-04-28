/**
 * Module dependencies
 */

var FormUrlencoded = require('form-urlencoded');


/**
 * Require signin
 */

function requireSignin (req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin?' + FormUrlencoded.encode(req.query));
  } else {
    next();
  }
}


/**
 * Exports
 */

module.exports = requireSignin;
