/**
 * Passport Configuration
 */

var _                = require('lodash')
  , cwd              = process.cwd()
  , env              = process.env.NODE_ENV || 'development'
  , path             = require('path')
  , util             = require('util')
  , config           = require(path.join(cwd, 'config.' + env + '.json'))
  , LocalStrategy    = require('passport-local').Strategy
  , OAuthStrategy    = require('../lib/strategies/OAuth')
  , OAuth2Strategy   = require('../lib/strategies/OAuth2')
  , base64url        = require('base64url')
  , User             = require('../models/User')
  ;


module.exports = function (passport) {


  /**
   * Sessions
   */

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.get(id, function (err, user) {
      done(err, user);
    });
  });


  /**
   * Local Strategy
   */

  passport.use(new LocalStrategy(
    { usernameField: 'email',  passReqToCallback: 'true' },
    function (req, email, password, done) {
      User.authenticate(email, password, function (err, user, info) {
        if (user) {
          // throw password value away so isn't included in URLs/logged
          delete req.connectParams.password;
          delete req.connectParams.email;
        }

        done(err, user, info);
      });
    }
  ));


  /**
   * OAuth Strategies
   */

  var providers = require('../lib/providers')

  function verifier (req, auth, userInfo, done) {
    User.connect(req, auth, userInfo, function (err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }

  if (config.providers) {
    Object.keys(config.providers).forEach(function (name) {
      var prov = providers[name]
        , conf = config.providers[name]
        ;

      if (prov && prov.protocol === 'OAuth 2.0') {
        passport.use(new OAuth2Strategy(prov, conf, verifier));
      }

      if (prov && prov.protocol === 'OAuth 1.0') {
        passport.use(new OAuthStrategy(prov, conf, verifier));
      }
    });
  }


};
