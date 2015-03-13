/**
 * Dependencies
 */

var async       = require('async')
  , settings    = require('../../boot/settings')
  , rclient     = require('../../config/redis')
  , Role        = require('../../models/Role')
  , Scope       = require('../../models/Scope')
  , Client      = require('../../models/Client')
  , ClientToken = require('../../models/ClientToken')
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
  ],

  clients: [
    {
      client_name: 'Anvil Connect Authority',
      redirect_uris: [issuer + '/callback'],
      trusted: 'true'
    },
    {
      client_name: 'Anvil Connect Developer',
      redirect_uris: [issuer + '/callback'],
      trusted: 'true'
    },
    {
      client_name: 'Anvil Connect Account',
      redirect_uris: [issuer + '/callback'],
      trusted: 'true'
    }
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
 * Insert Clients
 */

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
 * Tag Version
 */

function tag (done) {
  rclient.set('version', settings.version, function (err) {
    done(err);
  });
}

/**
 * Exports
 */

module.exports = function migrate (argv) {
  var multi = rclient.multi();
  multi.hlen('roles');
  multi.hlen('scopes');
  multi.hlen('clients');

  multi.exec(function (err, results) {
    if (err) { throw err; }

    var ops = [];

    if (results[0] === 0) { ops.push(insertRoles); }
    if (results[1] === 0) { ops.push(insertScopes); }
    if (ops.length === 2) { ops.push(assignPermissions); }
    if (results[2] === 0) { ops.push(insertClients); }

    if (ops.length > 0) {
      ops.push(tag)
    }

    async.parallel(ops, function (err, results) {
      if (err) {
        console.log(err.message);
      }

      else if (results.length === 0) {
        console.log('Already at v%s.', settings.version);
      }

      else {
        console.log('Anvil Connect migrated to v%s.', settings.version);
      }

      process.exit();
    });
  });
}
