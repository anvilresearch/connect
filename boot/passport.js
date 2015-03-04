/**
 * Passport Configuration
 */

var _         = require('lodash')
  , cwd       = process.cwd()
  , env       = process.env.NODE_ENV || 'development'
  , path      = require('path')
  , util      = require('util')
  , config    = require(path.join(cwd, 'config', env + '.json'))
  , providers = require('../providers')
  , base64url = require('base64url')
  , User      = require('../models/User')
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
   * Strategies
   */

  if (config.providers) {
    Object.keys(config.providers).forEach(function (name) {
      var providerConf   = config.providers[name]
        , provider = ( providers[name] ? providers[name] : providerConf )
        , protocol = provider.protocol
        , strategy = require('../protocols/' + protocol)
        ;

      provider.id = name;
      passport.use(strategy.initialize(provider, providerConf));
    });
  }


};
