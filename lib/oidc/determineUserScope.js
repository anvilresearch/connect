/**
 * Module dependencies
 */

var Scope = require('../../models/Scope');


/**
 * Determine user scope
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
