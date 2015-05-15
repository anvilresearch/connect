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

  server.get('/applications', authenticate, function (erq, res, next) {
    Client.listByTrusted('true', {
      select: [
        '_id',
        'client_name',
        'client_uri',
        'logo_uri',
        'trusted'
      ]
    }, function (err, clients) {
      if (err) { return next(err); }
      res.json(clients);
    });
  });

};
