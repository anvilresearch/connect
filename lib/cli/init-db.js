/**
 * Dependencies
 */

var async = require('async')
  , settings = require('../../settings')
  , Role  = require('../../models/Role')
  , Scope = require('../../models/Scope')
  , Client = require('../../models/Client')
  , ClientToken = require('../../models/ClientToken')
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
  ],

  clients: [
    {
      client_name: 'Anvil Connect Authority',
      redirect_uris: ['http://127.0.0.1/callback'],
      trusted: 'true'
    },
    {
      client_name: 'Anvil Connect Developer',
      redirect_uris: ['http://127.0.0.1/callback'],
      trusted: 'true'
    },
    {
      client_name: 'Anvil Connect Account',
      redirect_uris: ['http://127.0.0.1/callback'],
      trusted: 'true'
    }
  ]

};


/**
 * Persist
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

function insertClients (done) {
  async.map(defaults.clients, function (client, callback) {
    Client.insert(client, function (err, instance) {
      if (err) { return callback(err); }

      ClientToken.issue({
        iss: settings.issuer,
        sub: instance._id,
        aud: instance._id
      }, settings.privateKey, function (err, token) {
        if (err) { return callback(err); }
        console.log(
          'Created client "' + instance.client_name + '" (' + instance._id + ')'
        );
        callback(null, instance);
      });

    });

  }, function (err, scopes) {
    console.log('Created default clients.');
    done(err, scopes);
  });
}


/**
 * Exports
 */

module.exports = function init (argv) {
  async.parallel([
    insertRoles,
    insertScopes,
    assignPermissions,
    insertClients
  ], function (err, results) {
    if (err) {
      console.log(err);
    } else {
      console.log('Ready to run.');
    }
    process.exit();
  });
}
