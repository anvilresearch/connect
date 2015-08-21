/**
 * Module dependencies
 */

var fs = require('fs')
var path = require('path')

/**
 * Read models directory
 */

var files = fs.readdirSync(__dirname)

/**
 * Load models
 */

files.forEach(function (file) {
  if (path.extname(file) === '.js' && file !== 'index.js') {
    var model = path.basename(file, '.js')
    module.exports[model] = require(path.join(__dirname, '..', 'models', model))
  }
})
