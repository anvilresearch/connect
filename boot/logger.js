/**
 * Module dependencies
 */

var cwd = process.cwd()
var env = process.env.NODE_ENV || 'development'
var path = require('path')
var bunyan = require('express-bunyan-logger')
var ensureWritableDirectory = require('../lib/fs-utils').ensureWritableDirectory

/**
 * Logstreams
 */

var streams = []

if (!env.match(/test/i)) {
  var logs_path = path.join(cwd, 'logs')
  ensureWritableDirectory(logs_path)

  streams.push({ stream: process.stdout })
  streams.push({ path: path.join(logs_path, env + '.log') })
}

/**
 * Export
 */

module.exports = function (config) {
  var logger = bunyan(config || {
    name: 'request',
    streams: streams
  })

  module.exports = logger

  return logger
}
