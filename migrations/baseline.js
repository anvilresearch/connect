/**
 * Module dependencies
 */

var async = require('async')
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
    {
      name: 'openid',
      description: 'View your identity',
      restricted: false
    },
    {
      name: 'profile',
      description: 'View your basic account info',
      restricted: false,
      attributes: {
        user: [
          'name', 'family_name', 'given_name', 'middle_name', 'nickname',
          'preferred_username', 'profile', 'picture', 'website', 'gender',
          'birthdate', 'zoneinfo', 'locale', 'updated_at'
        ]
      }
    },
    {
      name: 'email',
      description: 'View your email address',
      restricted: false,
      attributes: {
        user: ['email', 'email_verified']
      }
    },
    {
      name: 'address',
      description: 'View your address',
      restricted: false,
      attributes: {
        user: ['address']
      }
    },
    {
      name: 'phone',
      description: 'View your phone number',
      restricted: false,
      attributes: {
        user: ['phone_number', 'phone_number_verified']
      }
    },
    {
      name: 'client',
      description: 'Register and configure clients'
    },
    {
      name: 'realm',
      description: 'Configure the security realm'
    }
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

module.exports = function () {
  return function baseline (next) {
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
