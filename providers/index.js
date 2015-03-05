/**
 * Module dependencies
 */

var fs = require('fs')
  , cwd = process.cwd()
  , path = require('path')
  , settings = require('../boot/settings')
  , defaultDirectory = __dirname
  , customDirectory = path.join(cwd, 'providers')
  ;


/**
 * Load providers
 */
function loadProviders (dir, files) {
  files.forEach(function (file) {
    if (path.extname(file) === '.js' && file !== 'index.js') {
      var provider = path.basename(file, '.js');

      try {
        module.exports[provider] = require(
          path.join(dir, provider)
        )(settings);
      } catch (e) {
        throw new Error("Can't load " + provider + " provider.");
      }
    }
  });
}

try {
  loadProviders(defaultDirectory, fs.readdirSync(defaultDirectory));
} catch (e) {}

try {
  loadProviders(customDirectory, fs.readdirSync(customDirectory));
} catch (e) {}
