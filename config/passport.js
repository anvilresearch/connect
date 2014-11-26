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
  , OAuth2Strategy   = require('../lib/strategies/OAuth2')
  , TwitterStrategy  = require('passport-twitter').Strategy
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

  var providers = config.providers;

  if (providers) {

    /**
     * Cut the verbosity of the config files
     */

    Object.keys(providers).forEach(function (name) {
      var callbackUrl = config.issuer + '/connect/' + name + '/callback';
      providers[name].callbackURL = callbackUrl;
      providers[name].passReqToCallback = true;
    });


    /**
     * Twitter
     */

    if (typeof providers.twitter === 'object') {
      passport.use(new TwitterStrategy(
        providers.twitter,
        function (request, token, secret, profile, done) {
          User.connect({
            provider: 'twitter',
            user:      request.user,
            token:     token,
            profile:   profile._json
          }, function (err, user) {
            if (err) { return done(err); }
            done(null, user);
          });
        }
      ));
    }

  }



  /**
   * OAuth 2.0 Strategies
   */

  var providers = require('../lib/providers')

  function verifier (request, response, profile, done) {
    User.connect({
      provider: profile.provider,
      user:     request.user,
      token:    response.access_token,
      profile:  profile
    }, function (err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }

  Object.keys(providers).forEach(function (name) {
    var prov = providers.name;

    if (prov && prov.protocol === 'OAuth 2.0') {
      passport.use(new OAuth2Strategy(prov.name, prov, verifier));
    }
  });


};
