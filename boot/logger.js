/**
 * Module dependencies
 */

var cwd = process.cwd()
var env = process.env.NODE_ENV || 'development'
var path = require('path')
var bunyan = require('express-bunyan-logger')

/**
 * Export
 */

module.exports = function (config) {
  var logger = bunyan(config || {
    name: 'request',
    streams: [
      { stream: process.stdout },
      { path: path.join(cwd, 'logs', env + '.log') }
    ]
  })

  module.exports = logger

  return logger
}
