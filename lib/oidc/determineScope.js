/**
 * Module dependencies
 */

var Scope = require('../../models/Scope');


/**
 * Determine scope
 *
 * We only want to issue scopes that are
 * DONE:
 * 1. requested (unless client is trusted)
 * 2. registered with the authorization server
 * TODO:
 * 3. permitted to the client
 * 4. permitted for the user
 */

function determineScope (req, res, next) {
  var params = req.connectParams;

  Scope.get(params.scope.split(' '), function (err, scopes) {
    if (err) { return next(err); }

    // remove null results
    req.scopes = scopes.reduce(function (list, scope) {
      if (scope instanceof Scope) {
        list.push(scope);
      }
      return list;
    }, []);

    //

    // extract scope names
    req.scope = req.scopes.map(function (scope) {
      return scope.name;
    }).join(' ');

    next();
  });
}


/**
 * Exports
 */

module.exports = determineScope;
