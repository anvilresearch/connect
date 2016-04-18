/**
 * Module dependencies
 */

var cwd = process.cwd()
var path = require('path')
var glob = require('glob')

/**
 * Extend
 */

function extend () {
  var directory = path.join(cwd, 'extensions', '*.js')
  var extensions = glob.sync(directory)

  extensions.forEach(function (filename) {
    try {
      require(filename)()
    } catch (e) {
      console.log('Cannot load extension"', filename, '"')
    }
  })
}

/**
 * Export
 */

module.exports = extend
