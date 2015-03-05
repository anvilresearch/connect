/**
 * Passport Configuration
 */

var settings  = require('./settings')
  , providers = require('../providers')
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

  if (settings.providers) {
    Object.keys(settings.providers).forEach(function (name) {
      var providerConf   = settings.providers[name]
        , provider = ( providers[name] ? providers[name] : providerConf )
        , protocol = provider.protocol
        , strategy = require('../protocols/' + protocol)
        ;

      provider.id = name;
      passport.use(strategy.initialize(provider, providerConf));
    });
  }


};
