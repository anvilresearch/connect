/* global process, __dirname */

/**
 * Module dependencies
 */

var fs = require('fs')
var path = require('path')

/**
 * Load migrations
 */

function loadMigrations (version) {
  var migrations = {}
  var files = fs.readdirSync(__dirname)

  // TODO:
  //    can we load only those modules that we'll need based on difference between
  //    existing version in db and current version of code?

  files.forEach(function () {
    if (path.extname(file) === '.js' && file !== 'index.js') {
      var key = path.basename(file, '.js')
      migrations[key] = require(file)(version)
    }
  })
}
/**
 * Export
 */

module.exports = loadMigrations
