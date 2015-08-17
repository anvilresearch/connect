/* global __dirname:true, process:true */

/**
 * Module dependencies
 */

var oidc             = require('../oidc')
  , settings         = require('../boot/settings')
  , mailer           = require('../boot/mailer')
  , passwordProvider = require('../providers').password
  , passport         = require('passport')
  , qs               = require('qs')
  , User             = require('../models/User')
  , nodemailer       = require('nodemailer')
  , path             = require('path')
  , url              = require('url')
  , templatesDir     = path.resolve(process.cwd(), 'email')
  , consolidate      = require('consolidate')
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

  function createUser(req, res, next) {
    User.insert(req.body, { private: true }, function (err, user) {
      if (err) {
        res.render('signup', {
          params:    qs.stringify(req.body),
          request:   req.body,
          providers: settings.providers,
          error:     err.message
        });
      } else {
        passport.authenticate('password', function (err, user, info) {
          if (!user) {
          } else {
            req.login(user, function (err) {
              if (err) { return next(err); }

              req.session.amr = req.session.amr || [];
              var samr = req.session.amr;
              var pamr = req.provider.amr;

              if (pamr && samr.indexOf(pamr) === -1) {
                req.session.amr.push(pamr);
              }

              req.sendVerificationEmail =
                req.provider.emailVerification.enable;
              req.flash('isNewUser', true);
              next();
            });
          }
        })(req, res, next);
      }
    });
  }

  function usePasswordProvider(req, res, next) {
    req.provider = passwordProvider;
    next();
  }

  var postSignupHandler = [
    oidc.selectConnectParams,
    oidc.validateAuthorizationParams,
    oidc.verifyClient,
    usePasswordProvider,
    oidc.enforceReferrer('/signup'),
    createUser,
    oidc.sendVerificationEmail,
    oidc.requireVerifiedEmail(),
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
  if (settings.providers.password) {
    server.get('/signup', getSignupHandler);
    server.post('/signup', postSignupHandler);
  } else {
    server.get('/signup', passwordsDisabledHandler);
    server.post('/signup', passwordsDisabledHandler);
  }

};



