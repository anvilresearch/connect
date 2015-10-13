/**
 * Module dependencies
 */

var async = require('async')
var semver = require('semver')
var Client = require('../models/Client')

/**
 * Migration
 *
 * 0.1.55. and prior used strings instead of booleans for the trusted
 * property on clients
 */

module.exports = function (version) {
  return function migration_0_1_56 (next) {
    if (semver.satisfies(version, '<0.1.56')) {
      Client.list({
        // list all clients, avoid paging
        page: 1,
        size: 0
      }, function (err, clients) {
        if (err) { return next(err) }

        async.map(clients, function (client, callback) {
          if (typeof client.trusted === 'string') {
            if (client.trusted === 'true') {
              client.trusted = true
            } else {
              client.trusted = false
            }

            Client.patch(client._id, client, function (err) {
              callback(err)
            })
          } else {
            callback()
          }
        }, next)
      })
    } else {
      next()
    }
  }
}
