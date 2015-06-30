/**
 * Module dependencies
 */

var async  = require('async')
  , User   = require('./User')
  , Client = require('./Client')


/**
 * User Applications
 */

function userApplications (user, callback) {
  async.parallel({

    // List the trusted clients
    trusted: function (done) {
      Client.listByTrusted('true', {
        select: [
          '_id',
          'client_name',
          'client_uri',
          'application_type',
          'logo_uri',
          'trusted',
          'scopes',
          'created',
          'modified'
        ]
      }, function (err, clients) {
        if (err) { return done(err); }
        done(null, clients);
      });
    },

    // Get the authorized scope for the user
    scopes: function (done) {
      user.authorizedScope(function (err, scopes) {
        if (err) { return done(err); }
        done(null, scopes);
      });
    },

    // List of client ids the user has visited
    visited: function (done) {
      var index = 'users:' + user._id + ':clients';
      Client.__client.zrevrange(index, 0, -1, function (err, ids) {
        if (err) { return done(err); }
        done(null, ids);
      })
    },

  }, function (err, results) {
    if (err) { return callback(err); }

    // Filter out clients if the user has none of the scopes
    // defined by the client.
    var clients = results.trusted.filter(function (client) {
      if (!client.scopes || client.scopes.length === 0) {
        return true;
      } else {
        return client.scopes.some(function (scope) {
          return (results.scopes.indexOf(scope) !== -1);
        });
      }
    });

    // Flag clients that have been visited
    clients.forEach(function (client) {
      client.visited = (results.visited.indexOf(client._id) !== -1);
    });

    callback(null, clients);
  });
}


/**
 * Exports
 */

module.exports = userApplications;
