/**
 * Module dependencies
 */

var Client = require('../models/Client')
  , authenticate = require('../oidc').authenticateUser
  ;


/**
 * Exports
 */

module.exports = function (server) {

  /**
   * Applications
   */

  server.get('/applications', authenticate, function (req, res, next) {
    Client.listByTrusted('true', {
      select: [
        '_id',
        'client_name',
        'client_uri',
        'logo_uri',
        'trusted',
        'scopes'
      ]
    }, function (err, clients) {
      if (err) { return next(err); }

      req.user.authorizedScope(function (err, authorizedScopes) {
        if (err) { return next(err); }

        var authorizedClients = clients.filter(function (client) {
          if (!client.scopes) {
            return true;
          } else {
            return client.scopes && client.scopes.some(function (scope) {
              return (authorizedScopes.indexOf(scope) !== -1)
            });
          }
        });

        res.json(authorizedClients);
      })
    });
  });

};
