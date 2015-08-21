/**
 * Module dependencies
 */

var async = require('async')
var cp = require('child_process')
var inquirer = require('inquirer')
var Modinha = require('modinha')
var settings = require('../../boot/settings')
var client = require('../../boot/redis')
client = client(settings.redis)
var User = require('../../models/User')
var Client = require('../../models/Client')
var Scope = require('../../models/Scope')
var AccessToken = require('../../models/AccessTokenJWT')
var ClientToken = require('../../models/ClientToken')

/**
 * Export
 */

module.exports = function token (argv) {
  var JWT = (argv.c) ? ClientToken : AccessToken

  async.parallel({
    users: function (done) {
      User.list(function (err, users) {
        if (err) { return done(err) }
        done(null, users.reduce(function (obj, user) {
          if (user) {
            var key = user.name +
              ' (' +
              (user.email || user.lastProvider) +
              ') ' +
              user._id

            obj[key] = user
          }
          return obj
        }, {}))
      })
    },

    clients: function (done) {
      Client.list(function (err, clients) {
        if (err) { return done(err) }
        done(null, clients.reduce(function (obj, client) {
          if (client) {
            obj[client.client_name + ' ' + client._id] = client
          }
          return obj
        }, {}))
      })
    }

  }, function (err, results) {
    if (err) {
      console.log(err)
      process.exit()
    }

    console.log()
    console.log('Please describe your desired JWT.')
    console.log()

    inquirer.prompt([

      {
        name: 'subject',
        message: 'Select a subject',
        type: 'list',
        choices: Object.keys((argv.c)
          ? results.clients
          : results.users)
      },

      {
        name: 'audience',
        message: 'Select an audience',
        type: 'list',
        choices: Object.keys(results.clients),
        when: function (answers) {
          return (!argv.c)
        }
      },

      {
        name: 'expires',
        message: 'Expires in (seconds)',
        type: 'input',
        default: 3600
      },

      {
        name: 'scopes',
        message: 'Enter space delimited scope list',
        type: 'input',
        default: (argv.c) ? 'client' : 'openid profile'
      }

    ], function (answers) {
      var scopes = answers.scopes
      var subject = results[(argv.c) ? 'clients' : 'users'][answers.subject]
      var audience = results.clients[answers.audience] || subject
      var expires = Date.now() + parseInt(answers.expires, 10)

      Scope.determine(scopes, subject, function (err, scope) {
        if (err) {
          console.log(err)
          process.exit()
        }

        var claims = {
          jti: Modinha.defaults.random(10)(),
          iss: settings.issuer,
          sub: subject._id,
          aud: audience._id,
          exp: expires,
          scope: scope
        }

        if (argv.c) {
          delete claims.jti
        }

        var token = new JWT(claims)
        var jwt = token.encode(settings.privateKey)

        var proc = cp.spawn('pbcopy')
        proc.stdin.write(jwt)
        proc.stdin.end()

        console.log()
        console.log('Header:')
        console.log(token.header)
        console.log()
        console.log('Payload:')
        console.log(claims)
        console.log()
        console.log('Signed JWT:')
        console.log(jwt)
        console.log()

        process.exit()
      })
    })
  })
}
