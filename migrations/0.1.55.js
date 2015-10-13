/**
 * Module dependencies
 */

var async = require('async')
var semver = require('semver')
var providers = require('../providers')
var User = require('../models/User')
var rclient = require('../boot/redis').getClient()

/**
 * Migration
 *
 * 0.1.54 and prior did not namespace user-by-provider indexes
 */

module.exports = function (version) {
  return function migration_0_1_55 (next) {
    if (semver.satisfies(version, '<0.1.55')) {
      var providerIDs = Object.keys(providers)

      async.map(providerIDs, function (provider, callback) {
        var index = User.collection + ':' + provider
        var newIndex = User.collection + ':provider:' + provider

        rclient.hgetall(index, function (err, result) {
          if (err) { return callback(err) }

          if (result && Object.getOwnPropertyNames(result).length) {
            rclient.rename(index, newIndex, function (err) {
              if (err) { return callback(err) }

              return callback()
            })
          } else {
            return callback()
          }
        })
      }, next)
    } else { next() }
  }
}
