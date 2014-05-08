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

function determineScope (req, res, next) {
  var params = req.connectParams;

  Scope.get(params.scope.split(' '), function (err, scopes) {
    if (err) { return next(err); }

    // remove null results
    var knownScope = scopes.reduce(function (list, scope) {
      if (scope instanceof Scope) {
        list.push(scope);
      }
      return list;
    }, []);

    // get authorized scope for user
    req.user.authorizedScope(function (err, authorizedScope) {
      if (err) { return callback(err); }

      // filter unauthorized scope
      req.scopes = knownScope.filter(function (scope) {
        return authorizedScope.indexOf(scope.name) !== -1;
      });

      // extract scope names
      req.scope = req.scopes.map(function (scope) {
        return scope.name;
      }).join(' ');

      next();
    });
  });
}


/**
 * Exports
 */

module.exports = determineScope;
