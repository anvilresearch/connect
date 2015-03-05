/**
 * Passport Configuration
 */

var settings  = require('./settings')
  , providers = require('../providers')
  , protocols = require('../protocols')
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
      var providerConf = settings.providers[name]
        , provider = ( providers[name] ? providers[name] : providerConf )
        ;

      passport.use(protocols.initialize(name, provider, providerConf));
    });
  }


};
