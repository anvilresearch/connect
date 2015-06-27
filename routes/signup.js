/**
 * Module dependencies
 */

var oidc     = require('../oidc')
  , settings = require('../boot/settings')
  , passport = require('passport')
  , qs       = require('qs')
  , User     = require('../models/User')
  , PasswordsDisabledError = require('../errors/PasswordsDisabledError')
  ;


/**
 * Signup Endpoint
 */

module.exports = function (server) {

  /**
   * Signup page
   */

  var getSignupHandler = [
    oidc.selectConnectParams,
    oidc.validateAuthorizationParams,
    oidc.verifyClient,
    function (req, res, next) {
      res.render('signup', {
        params:    qs.stringify(req.query),
        request:   req.query,
        providers: settings.providers
      });
    }
  ];


  /**
   * Password signup handler
   */

  var postSignupHandler = [
    oidc.selectConnectParams,
    oidc.validateAuthorizationParams,
    oidc.verifyClient,


    function (req, res, next) {
      User.insert(req.body, { private: true }, function (err, user) {
        if (err) {
          res.render('signup', {
            params:    qs.stringify(req.body),
            request:   req.body,
            providers: settings.providers,
            error:     err.message
          });
        } else {
          passport.authenticate('local', function (err, user, info) {
            if (!user) {
            } else {
              req.login(user, function (err) {
                next(err);
              });
            }
          })(req, res, next);
        }
      });
    },


    oidc.determineUserScope,
    oidc.promptToAuthorize,
    oidc.authorize
  ];


  if (oidc.beforeAuthorize) {
    postSignupHandler.splice(postSignupHandler.length - 1, 0, oidc.beforeAuthorize);
  }


  /**
   * Passwords Disabled Handler
   */

  function passwordsDisabledHandler (req, res, next) {
    next(new PasswordsDisabledError());
  }


  // Only register the password signup handlers
  // if the password protocol is enabled.
  if (settings.providers.password === true) {
    server.get('/signup', getSignupHandler);
    server.post('/signup', postSignupHandler);
  } else {
    server.get('/signup', passwordsDisabledHandler);
    server.post('/signup', passwordsDisabledHandler);
  }

};



