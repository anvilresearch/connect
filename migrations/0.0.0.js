/**
 * Module dependencies
 */

var async = require('async')
var semver = require('semver')
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
 * Exports
 */

module.exports = function (version) {
  return function migration_0_0_0 (next) {
    if (semver.satisfies(version, '<=0.0.0')) {
      async.parallel([
        insertRoles,
        insertScopes,
        assignPermissions
      ], function (err, results) {
        if (err) { return next(err) }
        next(null, results)
      })
    }
  }
}
