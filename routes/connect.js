/**
 * Module dependencies
 */

var oidc = require('../lib/oidc')
  , passport = require('passport')
  ;


/**
 * Third Party Provider Authorization Endpoints
 */

module.exports = function (server) {

  /**
   * Initiate Third Party Authorization
   */

  server.get('/connect/:provider',
    oidc.selectConnectParams,
    oidc.validateAuthorizationParams,
    oidc.verifyClient,
    oidc.stashParams,
    function (req, res, next) {
      var provider = req.params.provider
        , config = server.settings.providers[provider]
        ;

      // Authorize
      if (config) {
        passport.authenticate(provider, {
          scope: config.scope,
          state: req.authorizationId
        })(req, res);
      }

      // NOT FOUND
      else {
        next(new NotFoundError());
      }

    });


  /**
   * Handle Third Party Authorization
   */

  var handler = [
    oidc.unstashParams,
    oidc.verifyClient,

    function (req, res, next) {
      if (server.settings.providers[req.params.provider]) {
        passport.authenticate(req.params.provider, function (err, user, info) {
          if (err) { return next(err); }
          if (!user) {

          } else {
            req.login(user, function (err) {
              next(err);
            });
          }
        })(req, res, next);
      }

      // NOT FOUND
      else {
        next(new NotFoundError());
      }
    },

    oidc.determineUserScope,
    oidc.promptToAuthorize,
    oidc.authorize(server)
  ];

  if (oidc.beforeAuthorize) {
    handler.splice(handler.length - 1, 0, oidc.beforeAuthorize);
  }

  server.get('/connect/:provider/callback', handler);

};

