/**
 * Module dependencies
 */

var oidc           = require('../lib/oidc')
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
        request: req.query,
        providers: server.settings.providers
      });
    });


  /**
   * Password signup handler
   */

  server.post('/signup',
    oidc.selectConnectParams,
    oidc.validateAuthorizationParams,
    oidc.verifyClient,


    function (req, res, next) {
      User.insert(req.body, { private: true }, function (err, user) {
        console.log('SIGNUP INSERT USER', user);
        if (err) {
          res.render('signup', {
            params:    FormUrlencoded.encode(req.body),
            request:   req.body,
            providers: server.settings.providers,
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


    oidc.determineScope,
    oidc.promptToAuthorize,
    oidc.authorize
  );

};



