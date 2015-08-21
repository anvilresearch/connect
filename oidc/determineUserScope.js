/**
 * Module dependencies
 */

var Scope = require('../models/Scope')

/**
 * Determine user scope
 */

function determineUserScope (req, res, next) {
  var params = req.connectParams
  var scope = params.scope
  var subject = req.user

  Scope.determine(scope, subject, function (err, scope, scopes) {
    if (err) { return next(err) }
    req.scope = scope
    req.scopes = scopes
    next()
  })
}

/**
 * Exports
 */

module.exports = determineUserScope
