/**
 * Module dependencies
 */

var fs = require('fs')
  , path = require('path')
  , settings = require('../boot/settings')
  ;


/**
 * Read providers directory
 */

var files = fs.readdirSync(path.join('.', 'providers'));


/**
 * Load providers
 */

files.forEach(function (file) {
  if (path.extname(file) === '.js' && file !== 'index.js') {
    var provider = path.basename(file, '.js');
    module.exports[provider] = require(
      path.join('..', 'providers', provider)
    )(settings);
  }
});
