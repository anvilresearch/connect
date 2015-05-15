/**
 * Module dependencies
 */

var AccessToken = require('../models/AccessToken')
  , Client = require('../models/Client')
  , authenticate = require('../oidc').authenticateUser
  ;


/**
 * Exports
 */

module.exports = function (server) {

  /**
   * Authorizations
   * List clients a user has authorized.
   */

  server.get('/authorizations', authenticate, function (req, res, next) {
    var key = 'users:' + req.user._id + ':clients';

    AccessToken.__client.zrevrange(key, 0, -1, function (err, ids) {
      if (err) { return next(err); }

      Client.get(ids, {
        select: [
          '_id',
          'client_name',
          'client_uri',
          'logo_uri',
          'trusted'
        ]
      }, function (err, clients) {
        if (err) { return next(err); }
        // this should handle application/JSON or text/HTML
        // in the case of html content type, render a view listing
        // the authorized clients, with links to revoke access
        res.json(clients);
      });
    });
  });


  /**
   * Revoke authorization for a client
   */

  server.delete('/authorizations/:clientId', authenticate, function (req, res, next) {
    var uid = req.user && req.user._id
      , cid = req.params.clientId
      ;

    AccessToken.revoke(uid, cid, function (err, confirm) {
      console.log(err, confirm)
      if (err) { return next(err); }
      res.status(204).send()
    });
  });

};
