/**
 * Module dependencies
 */

var oidc           = require('../lib/oidc')
  , passport       = require('passport')
  , FormUrlencoded = require('form-urlencoded')
  ;


/**
 * Signin Endpoint
 */

module.exports = function (server) {

  /**
   * Signin page
   */

  server.get('/signin',
    oidc.selectConnectParams,
    oidc.validateAuthorizationParams,
    oidc.verifyClient,
    function (req, res, next) {
      res.render('signin', {
        params:    FormUrlencoded.encode(req.query),
        request:   req.query,
        providers: server.settings.providers
      });
    });


  /**
   * Password signin handler
   */

  server.post('/signin',
    oidc.selectConnectParams,
    oidc.validateAuthorizationParams,
    oidc.verifyClient,
    function (req, res, next) {
      passport.authenticate('local', function (err, user, info) {
        if (!user) {
          res.render('signin', {
            params:    FormUrlencoded.encode(req.body),
            request:   req.body,
            providers: server.settings.providers,
            error:     info.message
          });
        } else {
          req.login(user, function (err) {
            next(err);
          });
        }
      })(req, res, next);
    },
    oidc.determineScope,
    oidc.promptToAuthorize,
    oidc.authorize
  );

};

