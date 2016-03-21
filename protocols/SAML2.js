/**
 * Module dependencies
 */

var fs = require('fs')
var SAMLStrategy = require('passport-saml').Strategy
var User = require('../models/User')

/**
 * Verifier
 */

function verifier (provider, configuration) {
  return function (req, user, done) {
    if (typeof provider.mapping.id === 'function') 
      user.id = provider.mapping.id(user)
    else
      user.id = user[provider.mapping.id]
    console.log(user, user.getAssertionXml())
    User.connect(req, null, user, done)
  }
}

/**
 * Initialize
 */

function initialize (provider, configuration) {
  configuration.passReqToCallback = true
  configuration.path = provider.callbackUrl
  configuration.callbackUrl = provider.callbackUrl

  if (typeof configuration.cert === 'string') {
    try {
      configuration.cert = fs.readFileSync(configuration.cert, 'utf-8')
    } catch (err) {}
  }

  return new SAMLStrategy(configuration, verifier(provider, configuration))
}

/**
 * Exports
 */

module.exports = {
  verifier: verifier,
  initialize: initialize
}
