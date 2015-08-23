/**
 * Module dependencies
 */

var cp = require('child_process')
var proc = cp.spawn('pbcopy')
var path = require('path')
var root = path.join(__dirname, '..', '..')
var inquirer = require('inquirer')
var settings = require('../../boot/settings')
var Client = require(path.join(root, 'models', 'Client'))

/**
 * Export
 */

module.exports = function (argv) {
  Client.list(function (err, clients) {
    if (err) {
      console.log(err.message || err.error)
      process.exit()
    }

    var clientsByName = clients.reduce(function (obj, client) {
      obj[client.client_name + ' ' + client._id] = client
      return obj
    }, {})

    inquirer.prompt([
      {
        name: 'client',
        message: 'Select a client',
        type: 'list',
        choices: Object.keys(clientsByName)
      }
    ], function (answers) {
      var issuer = settings.issuer
      var client = clientsByName[answers.client]
      var uri = issuer +
        '/authorize?response_type=code' +
        '&client_id=' + client._id +
        '&redirect_uri=' + client.redirect_uris[0] +
        '&scope=openid+profile'

      proc.stdin.write(uri)
      proc.stdin.end()

      console.log()
      console.log('Copied Authorization URI for "%s" client to clipboard:', answers.client)
      console.log()
      console.log('  ' + uri)
      console.log()

      process.exit()
    })
  })
}
