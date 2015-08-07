/**
 * Passport Configuration
 */

var http      = require('http')
  , crypto    = require('crypto')
  , settings  = require('./settings')
  , providers = require('../providers')
  , protocols = require('../protocols')
  , User      = require('../models/User')
  , req       = http.IncomingMessage.prototype
  , logout    = req.logout
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
   * Wrap logout
   */

  req.logout = function () {
    this.session.opbs = crypto.randomBytes(256).toString('hex');
    delete this.session.amr;
    logout.call(this);
  }


  /**
   * Strategies
   */

  if (settings.providers) {
    Object.keys(settings.providers).forEach(function (id) {
      var providerConf = settings.providers[id]
        , provider = ( providers[id] ? providers[id] : providerConf )
        ;
      var strategy = protocols.initialize(id, provider, providerConf);
      strategy.name = id;
      passport.use(strategy);
    });
  }


};
