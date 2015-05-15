/**
 * Module dependencies
 */

var UnauthorizedError = require('../errors/UnauthorizedError');


/**
 * Authenticate User
 */

function authenticateUser (req, res, next) {
  if (!req.isAuthenticated()) {
    next(new UnauthorizedError({
      statusCode: 401
    }));
  } else {
    next();
  }
}

/**
 * Exports
 */

module.exports = authenticateUser;
