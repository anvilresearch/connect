/**
 * Passport Configuration
 */

var crypto = require('crypto')
var settings = require('./settings')
var providers = require('../providers')
var protocols = require('../protocols')
var oidc = require('../oidc')
var User = require('../models/User')

var strategies = {}

exports.registerProviders = function () {
  Object.keys(settings.providers).forEach(function (id) {
    var providerConf = settings.providers[id]
    var provider = providers[id] ? providers[id] : providerConf

    var strategy = protocols.initialize(id, provider, providerConf)
    strategies[id] = strategy
  })
}

exports.authenticate = function (provider, req, res, next, options, callback) {
  var baseStrategy = strategies[provider]

  if (!baseStrategy) {
    var cb = callback || next
    return cb(new Error(
      'No strategy defined for provider \'' +
      provider + '\''
    ))
  }

  if (!callback) {
    callback = options
    options = undefined
  }

  var strategy = Object.create(baseStrategy)

  strategy.success = function (user, info) {
    req.user = user
    if (callback) {
      callback(null, user, info)
    } else {
      next()
    }
  }

  strategy.fail = function (info, status) {
    if (callback) {
      callback(null, null, info)
    } else {
      User.get(req.session.user, function (err, user) {
        if (err) {
          return strategy.error(err)
        }
        if (!user) {
          delete req.session.user
          return next()
        }
        req.user = user
        next()
      })
    }
  }

  strategy.pass = function () {
    next()
  }

  strategy.error = function (err) {
    if (callback) {
      callback(err)
    } else {
      next(err)
    }
  }

  strategy.redirect = function (url, status) {
    res.redirect(status || 302, url)
  }

  strategy.authenticate(req, options)
}

exports.login = function (req, user) {
  oidc.setSessionAmr(req.session, req.provider.amr)

  // only update the OP Browser State if the user is not already logged in
  if (req.session.user !== user._id) {
    req.session.user = user._id
    req.session.opbs = crypto.randomBytes(256).toString('hex')
  }
}

exports.logout = function (req) {
  req.user = null
  delete req.session.user
  req.session.opbs = crypto.randomBytes(256).toString('hex')
  delete req.session.amr
}
