/**
 * Module dependencies
 */

var fs   = require('fs')
  , path = require('path')
  ;


/**
 * Read models directory
 */

var files = fs.readdirSync(path.join('.', 'models'));


/**
 * Load models
 */

files.forEach(function (file) {
  if (path.extname(file) === '.js' && file !== 'index.js') {
    var model = path.basename(file, '.js');
    module.exports[model] = require(path.join('..', 'models', model));
  }
});

