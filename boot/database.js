/* global process */

/**
 * Dependencies
 */

var async = require('async')
var semver = require('semver')
var settings = require('./settings')
var providers = require('../providers')
var rclient = require('./redis').getClient()
var Client = require('../models/Client')
var User = require('../models/User')
var Role = require('../models/Role')
var Scope = require('../models/Scope')

/**
 * Data
 */

var defaults = {
  roles: [
    { name: 'authority' },
    { name: 'developer' }
  ],

  scopes: [
    { name: 'openid', description: 'View your identity' },
    { name: 'profile', description: 'View your basic account info' },
    { name: 'client', description: 'Register and configure clients' },
    { name: 'realm', description: 'Configure the security realm' }
  ],

  permissions: [
    ['authority', 'realm'],
    ['developer', 'client']
  ]

}

/**
 * Insert Roles
 */

function insertRoles (done) {
  async.map(defaults.roles, function (role, callback) {
    Role.insert(role, function (err, instance) {
      callback(err, instance)
    })
  }, function (err, roles) {
    done(err, roles)
  })
}

/**
 * Insert Scopes
 */

function insertScopes (done) {
  async.map(defaults.scopes, function (scope, callback) {
    Scope.insert(scope, function (err, instance) {
      callback(err, instance)
    })
  }, function (err, scopes) {
    done(err, scopes)
  })
}

/**
 * Assign Permissions
 */

function assignPermissions (done) {
  async.map(defaults.permissions, function (pair, callback) {
    Role.addScopes(pair[0], pair[1], function (err, result) {
      callback(err, result)
    })
  }, function (err, results) {
    done(err, results)
  })
}

/**
 * Migrate data
 */

function migrateData (version, done) {
  if (!version) { return done() }

  async.series([
    function namespaceUserByProviderIndex (next) {
      if (semver.satisfies(version, '<=0.1.54')) {
        // 0.1.54 and prior did not namespace user-by-provider indexes
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
    },
    function updateClientTrustedToBoolean (next) {
      if (semver.satisfies(version, '<=0.1.55')) {
        // 0.1.55 and prior used strings instead of booleans for the trusted
        // property on clients
        Client.list(function (err, clients) {
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
            } else { callback() }
          }, next)
        })
      } else { next() }
    }
  ], done)
}

/**
 * Tag Version
 */

function updateVersion (done) {
  rclient.set('anvil:connect:version', settings.version, function (err) {
    done(err)
  })
}

/**
 * Exports
 */

module.exports = function setup () {
  var multi = rclient.multi()

  // TODO: Remove check against "version" key when time is right
  // This key has been deprecated in favour of "anvil:connect:version"
  multi.get('version')
  multi.get('anvil:connect:version')
  multi.dbsize()

  multi.exec(function (err, results) {
    if (err) {
      console.log(Array.isArray(err) ? err[0].message : err.message)
      process.exit(1)
    }

    var version = results[1][1] || results[0][1]
    var dbsize = results[2][1]

    if (!version && dbsize > 0) {
      if (process.argv.indexOf('--no-db-check') === -1) {
        console.log(
          "\nRedis already contains data, but it doesn't seem to be an " +
          'Anvil Connect database.\nIf you are SURE it is, start the server ' +
          'with --no-db-check to skip this check.\n'
        )
        return process.exit(1)
      }
    }

    async.parallel([
      insertRoles,
      insertScopes,
      assignPermissions,
      async.apply(migrateData, version)
    ], function (err, results) {
      if (err) {
        console.log('Unable to initialize Redis database.')
        console.log(err.message)
        return process.exit(1)
      }

      updateVersion(function (err) {
        if (err) {
          console.log('Unable to initialize Redis database.')
          console.log(err.message)
          return process.exit(1)
        }

        console.log('Successfully initialized Redis database.')
      })
    })
  })
}
