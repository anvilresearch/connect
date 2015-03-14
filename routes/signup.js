/**
 * Module dependencies
 */

var oidc           = require('../oidc')
  , settings       = require('../boot/settings')
  , passport       = require('passport')
  , FormUrlencoded = require('form-urlencoded')
  , User           = require('../models/User')
  ;


/**
 * Signup Endpoint
 */

module.exports = function (server) {

  /**
   * Signup page
   */

  server.get('/signup',
    oidc.selectConnectParams,
    oidc.validateAuthorizationParams,
    oidc.verifyClient,
    function (req, res, next) {
      res.render('signup', {
        params:    FormUrlencoded.encode(req.query),
        request:   req.query,
        providers: settings.providers
      });
    });


  /**
   * Password signup handler
   */

  var handler = [
    oidc.selectConnectParams,
    oidc.validateAuthorizationParams,
    oidc.verifyClient,


    function (req, res, next) {
      User.insert(req.body, { private: true }, function (err, user) {
        if (err) {
          res.render('signup', {
            params:    FormUrlencoded.encode(req.body),
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
    handler.splice(handler.length - 1, 0, oidc.beforeAuthorize);
  }

  server.post('/signup', handler);

};



