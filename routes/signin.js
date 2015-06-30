/**
 * Module dependencies
 */

var oidc     = require('../oidc')
  , settings = require('../boot/settings')
  , passport = require('passport')
  , crypto   = require('crypto')
  , qs       = require('qs')
  , InvalidRequestError = require('../errors/InvalidRequestError')
  , providers = require('../providers')
  ;

var providerInfo = {};
var providerNames = Object.keys(providers);
for (var i = 0; i < providerNames.length; i++) {
  providerInfo[providerNames[i]] = providers[providerNames[i]];
}


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
        params:    qs.stringify(req.query),
        request:   req.query,
        providers: settings.providers,
        providerInfo: providerInfo
      });
    });


  /**
   * Password signin handler
   */

  var handler = [
    oidc.selectConnectParams,
    oidc.validateAuthorizationParams,
    oidc.verifyClient,
    function (req, res, next) {
      if (!settings.providers[req.body.provider]) {
        next(new InvalidRequestError());
      } else {
        passport.authenticate(req.body.provider, function (err, user, info) {
          if (err) {
            res.render('signin', {
              params:    qs.stringify(req.body),
              request:   req.body,
              providers: settings.providers,
              providerInfo: providerInfo,
              error:     err.message
            });
          } else if (!user) {
            res.render('signin', {
              params:    qs.stringify(req.body),
              request:   req.body,
              providers: settings.providers,
              providerInfo: providerInfo,
              formError:     info.message
            });
          } else {
            req.login(user, function (err) {
              req.session.opbs = crypto.randomBytes(256).toString('hex');
              next(err);
            });
          }
        })(req, res, next);
      }
    },
    oidc.determineUserScope,
    oidc.promptToAuthorize,
    oidc.authorize
  ];

  if (oidc.beforeAuthorize) {
    handler.splice(handler.length - 1, 0, oidc.beforeAuthorize);
  }

  server.post('/signin', handler);

  // Only register the password signin post handler
  // if the password protocol is enabled.
  // if (settings.providers.password === true) {
  //  server.post('/signin', handler);
  // } else {
  //  server.post('/signin', function (req, res, next) {
  //  next(new PasswordsDisabledError());
  // });
  // }

};

