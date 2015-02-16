/**
 * Module dependencies
 */

var Scope = require('../../models/Scope');


/**
 * Determine scope
 *
 * We only want to issue scopes that are
 * DONE:
 * 1. requested
 * 2. registered with the authorization server
 * 4. permitted for the user
 * TODO:
 * 3. permitted to the client
 */

function determineUserScope (req, res, next) {
  var params  = req.connectParams
    , scope   = params.scope
    , subject = req.user
    ;

  Scope.determine(scope, subject, function (err, scope, scopes) {
    if (err) { next(err); }
    req.scope = scope;
    req.scopes = scopes;
    next();
  });
}


/**
 * Exports
 */

module.exports = determineUserScope;
