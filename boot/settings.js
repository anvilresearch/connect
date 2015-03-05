/**
 * Module dependencies
 */

var cwd      = process.cwd()
  , env      = process.env.NODE_ENV || 'development'
  , fs       = require('fs')
  , path     = require('path')
  ;


/**
 * Exports
 */

module.exports = require(path.join(cwd, 'config', env + '.json'));
