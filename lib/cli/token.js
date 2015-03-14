/**
 * Module dependencies
 */

var async       = require('async')
  , cp          = require('child_process')
  , inquirer    = require('inquirer')
  , Modinha     = require('modinha')
  , settings    = require('../../boot/settings')
  , User        = require('../../models/User')
  , Client      = require('../../models/Client')
  , Scope       = require('../../models/Scope')
  , AccessToken = require('../../models/AccessTokenJWT')
  , ClientToken = require('../../models/ClientToken')
  ;


/**
 * Export
 */


module.exports = function token (argv) {

  var Model = (argv.c) ? Client : User
    , JWT   = (argv.c) ? ClientToken : AccessToken
    , uuid  = argv._[1]
    ;

  async.parallel({

    users: function (done) {
      User.list(function (err, users) {
        if (err) { return done(err); }
        done(null, users.reduce(function (obj, user) {
          if (user) {
            var key = user.name
                    + ' ('
                    + (user.email || user.lastProvider)
                    + ') '
                    + user._id
                    ;
            obj[key] = user;
          }
          return obj;
        }, {}));
      });
    },

    clients: function (done) {
      Client.list(function (err, clients) {
        if (err) { return done(err); }
        done(null, clients.reduce(function (obj, client) {
          if (client) {
            obj[client.client_name + ' ' + client._id] = client;
          }
          return obj;
        }, {}));
      });
    }

  }, function (err, results) {

    if (err) {
      console.log(err);
      process.exit();
    }


    console.log();
    console.log('Please describe your desired JWT.');
    console.log();


    inquirer.prompt([

      {
        name:     'subject',
        message:  'Select a subject',
        type:     'list',
        choices:   Object.keys((argv.c)
                                ? results.clients
                                : results.users)
      },

      {
        name:     'audience',
        message:  'Select an audience',
        type:     'list',
        choices:   Object.keys(results.clients),
        when: function (answers) {
          return (!argv.c);
        }
      },

      {
        name:     'expires',
        message:  'Expires in (seconds)',
        type:     'input',
        default:   3600
      },

      {
        name:     'scopes',
        message:  'Enter space delimited scope list',
        type:     'input',
        default:  (argv.c) ? 'client' : 'openid profile'
      }

    ], function (answers) {

      var scopes    = answers.scopes
        , subject   = results[(argv.c)
                                ? 'clients'
                                : 'users'][answers.subject]
        , audience  = results.clients[answers.audience] || subject
        , expires   = answers.expires
        ;

      Scope.determine(scopes, subject, function (err, scope) {
        if (err) {
          console.log(err);
          process.exit();
        }

        var claims = {
          jti: Modinha.defaults.random(10)(),
          iss: settings.issuer,
          sub: subject._id,
          aud: audience._id,
          exp: expires,
          scope: scope
        };

        if (argv.c) {
          delete claims.jti
        }

        var token = new JWT(claims)
          , jwt = token.encode(settings.privateKey)
          ;

        var proc = cp.spawn('pbcopy');
        proc.stdin.write(jwt);
        proc.stdin.end();

        console.log();
        console.log('Header:');
        console.log(token.header);
        console.log();
        console.log('Payload:');
        console.log(claims);
        console.log();
        console.log('Signed JWT:');
        console.log(jwt);
        console.log();

        process.exit();
      });
    });
  });
}
