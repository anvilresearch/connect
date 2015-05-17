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
    Client.listAuthorizedByUser(req.user._id, function (err, clients) {
      if (err) { return next(err); }
      res.json(clients);
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
      if (err) { return next(err); }
      res.status(204).send()
    });
  });

};
