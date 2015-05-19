/**
 * Module dependencies
 */

var settings = require('../boot/settings')
  , oidc     = require('../oidc')
  , passport = require('passport')
  , crypto   = require('crypto')
  , qs       = require('qs')
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
        , config = settings.providers[provider]
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
      if (settings.providers[req.params.provider]) {
        passport.authenticate(req.params.provider, function (err, user, info) {
          if (err) { return next(err); }

          // render the signin screen with an error
          if (!user) {
            res.render('signin', {
              params:    qs.stringify(req.connectParams),
              request:   req.body,
              providers: info.providers,
              error:     info.message
            });
          }

          // login the user
          else {
            req.login(user, function (err) {
              req.session.opbs = crypto.randomBytes(256).toString('hex');
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
    oidc.authorize
  ];

  if (oidc.beforeAuthorize) {
    handler.splice(handler.length - 1, 0, oidc.beforeAuthorize);
  }

  server.get('/connect/:provider/callback', handler);


  /**
   * Revoke Third Party Authorization
   */

  server.all('/connect/:provider/revoke',
    oidc.parseAuthorizationHeader,
    oidc.getBearerToken,
    oidc.verifyAccessToken({
      iss: settings.issuer,
      key: settings.publicKey,
    }),
    oidc.revoke
  );

};

