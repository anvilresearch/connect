/**
 * Module dependencies
 */

var authenticate     = require('../oidc').authenticateUser
  , userApplications = require('../models/UserApplications')
  ;


/**
 * Exports
 */

module.exports = function (server) {

  /**
   * Applications
   */

  server.get('/applications', authenticate, function (req, res, next) {
    userApplications(req.user, function (err, apps) {
      if (err) { return next(err); }
      res.json(apps);
    });
  });

};
