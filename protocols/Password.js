/**
 * Module dependencies
 */

var LocalStrategy = require('passport-local').Strategy
var User = require('../models/User')
var Role = require('../models/Role')

/**
 * Verifier
 */

function verifier (configuration) {
  return function (req, email, password, done) {
    User.authenticate(email, password, function (err, user, info) {
      if (err) { return done(err, null, info) }
      if (user) {
        // throw password value away so isn't included in URLs/logged
        delete req.connectParams.password
        delete req.connectParams.email
      }

      if (!configuration.allowRoles) {
        return done(null, user, info)
      } else if (!user) {
        return done(null, false, { message: 'Unknown user.' })
      } else {
        Role.listByUsers(user, function (err, roles) {
          if (err) { return done(err) }

          var hasRoles = roles && roles.some(function (role) {
            return configuration.allowRoles.indexOf(role.name) !== -1
          })

          if (hasRoles) {
            return done(null, user, info)
          } else {
            return done(null, false, { message: 'Unknown user.' })
          }
        })
      }
    })
  }
}

LocalStrategy.verifier = verifier

/**
 * Initialize
 */

function initialize (provider, configuration) {
  return new LocalStrategy(provider, verifier(configuration))
}

LocalStrategy.initialize = initialize

/**
 * Exports
 */

module.exports = LocalStrategy
