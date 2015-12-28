/**
 * Module dependencies
 */

var Scope = require('../models/Scope')

/**
 * Get Authorized Scopes
 * Rename this to disambiguate from determineUserScope
 */

function getAuthorizedScopes (req, res, next) {
  // Get the scopes authorized for the verified and decoded token
  var scopeNames = req.claims.scope && req.claims.scope.split(' ')

  Scope.get(scopeNames, function (err, scopes) {
    if (err) { return next(err) }
    req.scopes = scopes
    next()
  })
}

/**
 * Exports
 */

module.exports = getAuthorizedScopes
