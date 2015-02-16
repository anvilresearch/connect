/**
 * Module dependencies
 */

var Scope = require('../../models/Scope');


/**
 * Determine client scope
 */

function determineClientScope (req, res, next) {
  var params  = req.connectParams
    , subject = req.client
    , scope   = params.scope || subject.default_client_scope
    ;

  if (params.grant_type === 'client_credentials') {
    Scope.determine(scope, subject, function (err, scope, scopes) {
      if (err) { next(err); }
      req.scope = scope;
      req.scopes = scopes;
      next();
    });
  } else {
    next();
  }
}


/**
 * Exports
 */

module.exports = determineClientScope;
