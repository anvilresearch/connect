/**
 * Dependencies
 */

var async       = require('async')
  , settings    = require('../boot/settings')
  , rclient     = require('../boot/redis')
  , Role        = require('../models/Role')
  , Scope       = require('../models/Scope')
  , issuer      = settings.issuer
  ;


/**
 * Data
 */

var defaults = {

  roles: [
    { name: 'authority' },
    { name: 'developer' }
  ],

  scopes: [
    { name: 'openid',   description: 'View your identity' },
    { name: 'profile',  description: 'View your basic account info' },
    { name: 'client',   description: 'Register and configure clients' },
    { name: 'realm',    description: 'Configure the security realm' }
  ],

  permissions: [
    ['authority', 'realm'],
    ['developer', 'client']
  ]

};


/**
 * Insert Roles
 */

function insertRoles (done) {
  async.map(defaults.roles, function (role, callback) {
    Role.insert(role, function (err, instance) {
      callback(err, instance);
    })
  }, function (err, roles) {
    console.log('Created default roles.');
    done(err, roles);
  });
}


/**
 * Insert Scopes
 */

function insertScopes (done) {
  async.map(defaults.scopes, function (scope, callback) {
    Scope.insert(scope, function (err, instance) {
      callback(err, instance);
    })
  }, function (err, scopes) {
    console.log('Created default scopes.');
    done(err, scopes);
  });
}


/**
 * Assign Permissions
 */

function assignPermissions (done) {
  async.map(defaults.permissions, function (pair, callback) {
    Role.addScopes(pair[0], pair[1], function (err, result) {
      callback(err, result);
    });
  }, function (err, results) {
    console.log('Created default permissions.');
    done(err, results);
  })
}


/**
 * Tag Version
 */

function version (done) {
  rclient.set('version', settings.version, function (err) {
    done(err);
  });
}


/**
 * Exports
 */

module.exports = function setup () {
  var multi = rclient.multi();

  multi.get('version');
  multi.dbsize();

  multi.exec(function (err, results) {
    if (err) {
      console.log(err.message);
      process.exit(1);
    }

    var version = results[0];
    var dbsize = results[1];

    if (!version && dbsize > 0) {
      console.log('Appears to be connected to the wrong database.');
      process.exit(1);
    }

    if (!version && dbsize === 0) {
      async.parallel([
        insertRoles,
        insertScopes,
        assignPermissions,
        version
      ], function (err, results) {

      });
    }
  });
}
