/* global process, __dirname */

/**
 * Module dependencies
 */

var fs = require('fs')
var path = require('path')
var semver = require('semver')

/**
 * Load migrations
 */

function loadMigrations (version) {
  var migrations = []
  var files = fs.readdirSync(__dirname)

  // iterate through the files and load required modules
  files.forEach(function (file) {
    var isJavaScript = path.extname(file) === '.js'
    var isMigration = ['baseline.js', 'index.js'].indexOf(file) === -1
    var isRequired = isMigration && !semver.satisfies(path.basename(file, '.js'))

    if (isJavaScript && isMigration && isRequired) {
      migrations.push(require(path.join(__dirname, file))(version))
    }
  })

  return migrations
}
/**
 * Export
 */

module.exports = loadMigrations
