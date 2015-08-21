/**
 * Passport Configuration
 */

var settings = require('./settings')
var providers = require('../providers')
var protocols = require('../protocols')
var User = require('../models/User')

module.exports = function (passport) {
  /**
   * Sessions
   */

  passport.serializeUser(function (user, done) {
    done(null, user._id)
  })

  passport.deserializeUser(function (id, done) {
    User.get(id, function (err, user) {
      done(err, user)
    })
  })

  /**
   * Strategies
   */

  if (settings.providers) {
    Object.keys(settings.providers).forEach(function (id) {
      var providerConf = settings.providers[id]
      var provider = providers[id] ? providers[id] : providerConf

      var strategy = protocols.initialize(id, provider, providerConf)
      strategy.name = id
      passport.use(strategy)
    })
  }

}
