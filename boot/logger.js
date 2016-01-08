/**
 * Module dependencies
 */

var cwd = process.cwd()
var env = process.env.NODE_ENV || 'development'
var path = require('path')
var bunyan = require('express-bunyan-logger')
var ensureWritableDirectory = require('../lib/fs-utils').ensureWritableDirectory

/**
 * Export
 */

module.exports = function (options) {
  var logger
  var config = { name: 'request', streams: [] }

  if (!env.match(/test/i)) {
    var logsPath = path.join(cwd, 'logs')
    ensureWritableDirectory(logsPath)

    if (options && options.stdio) { config.streams.push({ stream: process.stdout }) }
    if (options && options.file) { config.streams.push({ path: path.join(logsPath, env + '.log') }) }

    try {
      config = require('../logger')
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') { throw e }
    }
  }

  logger = bunyan(config)
  module.exports = logger
  return logger
}
