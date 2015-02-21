/**
 * Module dependencies
 */

var AuthorizationError = require('../errors/AuthorizationError');


/**
 * Verify Client Params
 */

function verifyClientIdentifiers (req, res, next) {
  // mismatching client identifiers
  if (req.token.payload.sub !== req.params.clientId) {
    return next(new AuthorizationError({
      error: 'unauthorized_client',
      error_description: 'Mismatching client id',
      statusCode: 403
    }));
  }

  // all's well
  else {
    next();
  }
}


/**
 * Exports
 */

module.exports = verifyClientIdentifiers;
